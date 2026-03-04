import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import '../providers/ads_provider.dart';
import '../../data/models/category_model.dart';
import '../../../../core/constants/app_spacing.dart';

class AdCreatePage extends ConsumerStatefulWidget {
  const AdCreatePage({super.key});

  @override
  ConsumerState<AdCreatePage> createState() => _AdCreatePageState();
}

class _AdCreatePageState extends ConsumerState<AdCreatePage> {
  int _currentStep = 0;
  final _formKey = GlobalKey<FormState>();
  
  // Data
  CategoryModel? _selectedCategory;
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _priceController = TextEditingController();
  final _phoneController = TextEditingController();
  final _sellerNameController = TextEditingController();
  
  List<XFile> _selectedImages = [];
  final ImagePicker _picker = ImagePicker();
  
  Map<String, String> _propertyValues = {};
  List<String> _uploadedImageIds = [];
  String? _coverImageId;

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _priceController.dispose();
    _phoneController.dispose();
    _sellerNameController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep == 0 && _selectedCategory == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Lütfen bir kategori seçin')),
      );
      return;
    }
    
    if (_currentStep == 1 && !_formKey.currentState!.validate()) {
      return;
    }
    
    if (_currentStep < 3) {
      setState(() => _currentStep++);
    } else {
      _submit();
    }
  }

  void _previousStep() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
    }
  }

  Future<void> _pickImages() async {
    final List<XFile> images = await _picker.pickMultiImage();
    if (images.isNotEmpty) {
      setState(() {
        _selectedImages.addAll(images);
      });
    }
  }

  Future<void> _submit() async {
    if (_selectedImages.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('En az bir fotoğraf eklemelisiniz')),
      );
      return;
    }

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(child: CircularProgressIndicator()),
    );

    try {
      final repository = ref.read(adsRepositoryProvider);
      
      _uploadedImageIds.clear();
      for (var image in _selectedImages) {
        final id = await repository.uploadFile(image.path);
        _uploadedImageIds.add(id);
      }
      
      _coverImageId = _uploadedImageIds.first;

      final adData = {
        'category_id': _selectedCategory!.id,
        'title': _titleController.text,
        'description': _descriptionController.text,
        'price': int.parse(_priceController.text),
        'contact_phone': _phoneController.text,
        'seller_name': _sellerNameController.text,
        'image_ids': _uploadedImageIds,
        'cover_image_id': _coverImageId,
        'properties': _propertyValues.entries.map((e) => {
          'property_id': e.key,
          'value': e.value,
        }).toList(),
      };

      final success = await ref.read(adsProvider.notifier).createAd(adData);
      
      if (mounted) {
        Navigator.pop(context);
        if (success) {
          _showSuccessDialog();
        }
      }
    } catch (e) {
      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Hata: $e')),
        );
      }
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Text('İlanınız Alındı'),
        content: const Text(
          'İlanınız başarıyla oluşturuldu ve incelemeye alındı. Onaylandıktan sonra yayına girecektir.',
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.pop(context);
            },
            child: const Text('Tamam'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Yeni İlan Ver')),
      body: Stepper(
        type: StepperType.horizontal,
        currentStep: _currentStep,
        onStepContinue: _nextStep,
        onStepCancel: _previousStep,
        controlsBuilder: (context, details) {
          return Padding(
            padding: const EdgeInsets.only(top: AppSpacing.lg),
            child: Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: details.onStepContinue,
                    child: Text(_currentStep == 3 ? 'Yayınla' : 'Devam Et'),
                  ),
                ),
                if (_currentStep > 0) ...[
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: details.onStepCancel,
                      child: const Text('Geri'),
                    ),
                  ),
                ],
              ],
            ),
          );
        },
        steps: [
          Step(
            title: const Text('Kat.'),
            content: _buildCategoryStep(),
            isActive: _currentStep >= 0,
          ),
          Step(
            title: const Text('Bilgi'),
            content: _buildInfoStep(),
            isActive: _currentStep >= 1,
          ),
          Step(
            title: const Text('Özel.'),
            content: _buildPropertiesStep(),
            isActive: _currentStep >= 2,
          ),
          Step(
            title: const Text('Foto'),
            content: _buildPhotoStep(),
            isActive: _currentStep >= 3,
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryStep() {
    final categoriesAsync = ref.watch(adCategoriesProvider);
    return categoriesAsync.when(
      data: (categories) => ListView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: categories.length,
        itemBuilder: (context, index) {
          final category = categories[index];
          return ListTile(
            title: Text(category.name),
            trailing: _selectedCategory?.id == category.id
                ? const Icon(Icons.check_circle, color: Colors.green)
                : const Icon(Icons.chevron_right),
            onTap: () {
              setState(() => _selectedCategory = category);
            },
          );
        },
      ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Text('Hata: $e'),
    );
  }

  Widget _buildInfoStep() {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          TextFormField(
            controller: _titleController,
            decoration: const InputDecoration(labelText: 'İlan Başlığı'),
            validator: (v) => v == null || v.isEmpty ? 'Gerekli' : null,
          ),
          const SizedBox(height: AppSpacing.md),
          TextFormField(
            controller: _descriptionController,
            decoration: const InputDecoration(labelText: 'Açıklama'),
            maxLines: 3,
            validator: (v) => v == null || v.isEmpty ? 'Gerekli' : null,
          ),
          const SizedBox(height: AppSpacing.md),
          TextFormField(
            controller: _priceController,
            decoration: const InputDecoration(labelText: 'Fiyat (₺)'),
            keyboardType: TextInputType.number,
            validator: (v) => v == null || v.isEmpty ? 'Gerekli' : null,
          ),
          const SizedBox(height: AppSpacing.md),
          TextFormField(
            controller: _phoneController,
            decoration: const InputDecoration(labelText: 'İletişim Telefonu'),
            keyboardType: TextInputType.phone,
            validator: (v) => v == null || v.isEmpty ? 'Gerekli' : null,
          ),
          const SizedBox(height: AppSpacing.md),
          TextFormField(
            controller: _sellerNameController,
            decoration: const InputDecoration(labelText: 'İsim Soyisim'),
            validator: (v) => v == null || v.isEmpty ? 'Gerekli' : null,
          ),
        ],
      ),
    );
  }

  Widget _buildPropertiesStep() {
    if (_selectedCategory == null) return const Text('Önce kategori seçin');
    final propsAsync = ref.watch(categoryPropertiesProvider(_selectedCategory!.id));
    
    return propsAsync.when(
      data: (data) {
        if (data.properties.isEmpty) {
          return const Center(child: Text('Bu kategori için ek özellik bulunmuyor.'));
        }
        return Column(
          children: data.properties.map((prop) {
            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.md),
              child: TextFormField(
                decoration: InputDecoration(labelText: prop['property_name']),
                onChanged: (v) => _propertyValues[prop['id']] = v,
              ),
            );
          }).toList(),
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Text('Hata: $e'),
    );
  }

  Widget _buildPhotoStep() {
    return Column(
      children: [
        ElevatedButton.icon(
          onPressed: _pickImages,
          icon: const Icon(Icons.add_a_photo),
          label: const Text('Fotoğraf Ekle'),
        ),
        const SizedBox(height: AppSpacing.md),
        if (_selectedImages.isNotEmpty)
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              crossAxisSpacing: 8,
              mainAxisSpacing: 8,
            ),
            itemCount: _selectedImages.length,
            itemBuilder: (context, index) {
              return Stack(
                children: [
                  Positioned.fill(
                    child: Image.file(File(_selectedImages[index].path), fit: BoxFit.cover),
                  ),
                  Positioned(
                    top: 0,
                    right: 0,
                    child: IconButton(
                      icon: const Icon(Icons.cancel, color: Colors.red),
                      onPressed: () => setState(() => _selectedImages.removeAt(index)),
                    ),
                  ),
                ],
              );
            },
          ),
      ],
    );
  }
}
