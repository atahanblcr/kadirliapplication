import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../data/models/user_model.dart';
import '../providers/auth_provider.dart';

class RegisterPage extends ConsumerStatefulWidget {
  const RegisterPage({super.key});

  @override
  ConsumerState<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends ConsumerState<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _ageController = TextEditingController();

  NeighborhoodModel? _selectedNeighborhood;
  String _locationType = 'neighborhood';

  @override
  void dispose() {
    _usernameController.dispose();
    _ageController.dispose();
    super.dispose();
  }

  String? _validateUsername(String? value) {
    if (value == null || value.isEmpty) {
      return 'Kullanici adi giriniz';
    }
    if (value.length < 3) {
      return 'En az 3 karakter olmali';
    }
    if (value.length > 50) {
      return 'En fazla 50 karakter olabilir';
    }
    if (!RegExp(r'^[a-zA-Z0-9_]+$').hasMatch(value)) {
      return 'Sadece harf, rakam ve alt cizgi kullanilabilir';
    }
    return null;
  }

  String? _validateAge(String? value) {
    if (value == null || value.isEmpty) {
      return 'Yasinizi giriniz';
    }
    final age = int.tryParse(value);
    if (age == null) {
      return 'Gecerli bir yas giriniz';
    }
    if (age < 13 || age > 120) {
      return 'Yas 13 ile 120 arasinda olmali';
    }
    return null;
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    if (_selectedNeighborhood == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Lutfen mahalle seciniz'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    final success = await ref.read(authProvider.notifier).register(
          username: _usernameController.text.trim(),
          age: int.parse(_ageController.text.trim()),
          locationType: _locationType,
          primaryNeighborhoodId: _selectedNeighborhood!.id,
        );

    if (success && mounted) {
      Navigator.of(context).popUntil((route) => route.isFirst);
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final neighborhoodsAsync = ref.watch(neighborhoodsProvider);

    ref.listen<AuthState>(authProvider, (prev, next) {
      if (next.error != null && prev?.error != next.error) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.error!),
            backgroundColor: AppColors.error,
          ),
        );
        ref.read(authProvider.notifier).clearError();
      }
    });

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'Kayit Ol',
          style: TextStyle(color: AppColors.textPrimary),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Profile avatar placeholder
                Center(
                  child: CircleAvatar(
                    radius: 48,
                    backgroundColor: AppColors.grey200,
                    child: Icon(
                      Icons.person,
                      size: 48,
                      color: AppColors.grey500,
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.xxl),

                // Username
                TextFormField(
                  controller: _usernameController,
                  validator: _validateUsername,
                  inputFormatters: [
                    FilteringTextInputFormatter.allow(
                        RegExp(r'[a-zA-Z0-9_]')),
                    LengthLimitingTextInputFormatter(50),
                  ],
                  decoration: InputDecoration(
                    labelText: 'Kullanici Adi *',
                    hintText: 'ornek: ahmet_123',
                    prefixIcon: const Icon(Icons.person_outline),
                    border: OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(AppSpacing.radiusLg),
                    ),
                    filled: true,
                    fillColor: AppColors.surface,
                  ),
                ),
                const SizedBox(height: AppSpacing.md),

                // Age
                TextFormField(
                  controller: _ageController,
                  validator: _validateAge,
                  keyboardType: TextInputType.number,
                  inputFormatters: [
                    FilteringTextInputFormatter.digitsOnly,
                    LengthLimitingTextInputFormatter(3),
                  ],
                  decoration: InputDecoration(
                    labelText: 'Yas *',
                    hintText: '25',
                    prefixIcon: const Icon(Icons.cake_outlined),
                    border: OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(AppSpacing.radiusLg),
                    ),
                    filled: true,
                    fillColor: AppColors.surface,
                  ),
                ),
                const SizedBox(height: AppSpacing.md),

                // Location type
                DropdownButtonFormField<String>(
                  initialValue: _locationType,
                  decoration: InputDecoration(
                    labelText: 'Konum Tipi *',
                    prefixIcon: const Icon(Icons.map_outlined),
                    border: OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(AppSpacing.radiusLg),
                    ),
                    filled: true,
                    fillColor: AppColors.surface,
                  ),
                  items: const [
                    DropdownMenuItem(
                      value: 'neighborhood',
                      child: Text('Mahalle'),
                    ),
                    DropdownMenuItem(
                      value: 'village',
                      child: Text('Koy'),
                    ),
                  ],
                  onChanged: (value) {
                    if (value != null) {
                      setState(() {
                        _locationType = value;
                        _selectedNeighborhood = null;
                      });
                    }
                  },
                ),
                const SizedBox(height: AppSpacing.md),

                // Neighborhood dropdown
                neighborhoodsAsync.when(
                  data: (neighborhoods) {
                    // Filter by location type
                    final filtered = neighborhoods
                        .where((n) => n.type == _locationType)
                        .toList();

                    // Update label based on location type
                    final locationLabel =
                        _locationType == 'neighborhood' ? 'Mahalle' : 'Koy';
                    final hintText =
                        '$locationLabel seciniz';

                    return DropdownButtonFormField<NeighborhoodModel>(
                      initialValue: _selectedNeighborhood,
                      isExpanded: true,
                      decoration: InputDecoration(
                        labelText: '$locationLabel / Koy *',
                        prefixIcon:
                            const Icon(Icons.location_on_outlined),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(
                              AppSpacing.radiusLg),
                        ),
                        filled: true,
                        fillColor: AppColors.surface,
                      ),
                      hint: Text(hintText),
                      items: filtered.map((n) {
                        return DropdownMenuItem(
                          value: n,
                          child: Text(n.name),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedNeighborhood = value;
                        });
                      },
                    );
                  },
                  loading: () => const Padding(
                    padding: EdgeInsets.all(AppSpacing.md),
                    child: Center(child: CircularProgressIndicator()),
                  ),
                  error: (error, _) => Padding(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    child: Column(
                      children: [
                        Text(
                          'Mahalle listesi yuklenemedi',
                          style: TextStyle(color: AppColors.error),
                        ),
                        TextButton(
                          onPressed: () => ref.invalidate(neighborhoodsProvider),
                          child: const Text('Tekrar Dene'),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.xxl),

                // Register button
                SizedBox(
                  width: double.infinity,
                  height: AppSpacing.buttonLarge,
                  child: ElevatedButton(
                    onPressed: authState.isLoading ? null : _submit,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: AppColors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(AppSpacing.radiusLg),
                      ),
                      elevation: 2,
                    ),
                    child: authState.isLoading
                        ? const SizedBox(
                            width: 24,
                            height: 24,
                            child: CircularProgressIndicator(
                              color: AppColors.white,
                              strokeWidth: 2,
                            ),
                          )
                        : const Text(
                            'Kayit Ol',
                            style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600),
                          ),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
