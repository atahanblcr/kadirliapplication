import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/ads_provider.dart';
import '../../data/models/ad_model.dart';
import '../../../../core/constants/app_spacing.dart';

class AdEditPage extends ConsumerStatefulWidget {
  final AdModel ad;

  const AdEditPage({required this.ad, super.key});

  @override
  ConsumerState<AdEditPage> createState() => _AdEditPageState();
}

class _AdEditPageState extends ConsumerState<AdEditPage> {
  int _currentStep = 0;
  final _formKey = GlobalKey<FormState>();
  
  late final TextEditingController _titleController;
  late final TextEditingController _descriptionController;
  late final TextEditingController _priceController;
  late final TextEditingController _phoneController;
  late final TextEditingController _sellerNameController;
  
  Map<String, String> _propertyValues = {};

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.ad.title);
    _descriptionController = TextEditingController(text: widget.ad.description);
    _priceController = TextEditingController(text: widget.ad.price.toString());
    _phoneController = TextEditingController(text: widget.ad.contactPhone);
    _sellerNameController = TextEditingController(text: widget.ad.seller?['username'] ?? '');
    
    if (widget.ad.properties != null) {
      for (var prop in widget.ad.properties!) {
        _propertyValues[prop['id']] = prop['value'] ?? '';
      }
    }
  }

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
    if (_currentStep == 0 && !_formKey.currentState!.validate()) return;
    if (_currentStep < 2) {
      setState(() => _currentStep++);
    } else {
      _submit();
    }
  }

  Future<void> _submit() async {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(child: CircularProgressIndicator()),
    );

    try {
      final adData = {
        'title': _titleController.text,
        'description': _descriptionController.text,
        'price': int.parse(_priceController.text),
        'contact_phone': _phoneController.text,
        'seller_name': _sellerNameController.text,
        'properties': _propertyValues.entries.map((e) => {
          'property_id': e.key,
          'value': e.value,
        }).toList(),
      };

      final success = await ref.read(adsProvider.notifier).updateAd(widget.ad.id, adData);
      
      if (mounted) {
        Navigator.pop(context);
        if (success) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('İlan başarıyla güncellendi')),
          );
          Navigator.pop(context);
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('İlanı Düzenle')),
      body: Stepper(
        type: StepperType.horizontal,
        currentStep: _currentStep,
        onStepContinue: _nextStep,
        onStepCancel: () => _currentStep > 0 ? setState(() => _currentStep--) : Navigator.pop(context),
        steps: [
          Step(
            title: const Text('Bilgi'),
            content: _buildInfoStep(),
            isActive: _currentStep >= 0,
          ),
          Step(
            title: const Text('Özel.'),
            content: _buildPropertiesStep(),
            isActive: _currentStep >= 1,
          ),
          Step(
            title: const Text('Onay'),
            content: const Center(child: Text('Değişiklikleri kaydetmek için Devam Et butonuna tıklayın.')),
            isActive: _currentStep >= 2,
          ),
        ],
      ),
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
        ],
      ),
    );
  }

  Widget _buildPropertiesStep() {
    final propsAsync = ref.watch(categoryPropertiesProvider(widget.ad.category.id));
    
    return propsAsync.when(
      data: (data) => Column(
        children: data.properties.map((prop) {
          return Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.md),
            child: TextFormField(
              initialValue: _propertyValues[prop['id']],
              decoration: InputDecoration(labelText: prop['property_name']),
              onChanged: (v) => _propertyValues[prop['id']] = v,
            ),
          );
        }).toList(),
      ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Text('Hata: $e'),
    );
  }
}
