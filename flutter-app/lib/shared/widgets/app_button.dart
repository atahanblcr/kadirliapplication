import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_spacing.dart';

/// App Button Widget
/// Reusable button component with multiple variants

class AppButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final ButtonVariant variant;
  final ButtonSize size;
  final bool isLoading;
  final bool isEnabled;
  final Widget? icon;
  final IconPosition iconPosition;
  final double? width;
  final double? height;

  const AppButton({
    Key? key,
    required this.label,
    this.onPressed,
    this.variant = ButtonVariant.primary,
    this.size = ButtonSize.medium,
    this.isLoading = false,
    this.isEnabled = true,
    this.icon,
    this.iconPosition = IconPosition.left,
    this.width,
    this.height,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width ?? double.infinity,
      height: height ?? _getHeight(),
      child: _buildButton(),
    );
  }

  Widget _buildButton() {
    switch (variant) {
      case ButtonVariant.primary:
        return _buildFilledButton();
      case ButtonVariant.secondary:
        return _buildOutlinedButton();
      case ButtonVariant.tertiary:
        return _buildTextButton();
    }
  }

  Widget _buildFilledButton() {
    return FilledButton(
      onPressed: isLoading || !isEnabled ? null : onPressed,
      style: FilledButton.styleFrom(
        backgroundColor: AppColors.primary,
        disabledBackgroundColor: AppColors.grey300,
      ),
      child: _buildContent(),
    );
  }

  Widget _buildOutlinedButton() {
    return OutlinedButton(
      onPressed: isLoading || !isEnabled ? null : onPressed,
      style: OutlinedButton.styleFrom(
        side: const BorderSide(color: AppColors.primary),
        disabledForegroundColor: AppColors.grey400,
      ),
      child: _buildContent(),
    );
  }

  Widget _buildTextButton() {
    return TextButton(
      onPressed: isLoading || !isEnabled ? null : onPressed,
      child: _buildContent(),
    );
  }

  Widget _buildContent() {
    if (isLoading) {
      return const SizedBox(
        height: 20,
        width: 20,
        child: CircularProgressIndicator(strokeWidth: 2),
      );
    }

    if (icon == null) {
      return Text(label);
    }

    final widgets = [
      icon!,
      SizedBox(width: iconPosition == IconPosition.left ? AppSpacing.sm : 0),
      Text(label),
      SizedBox(width: iconPosition == IconPosition.right ? AppSpacing.sm : 0),
    ];

    if (iconPosition == IconPosition.right) {
      return Row(mainAxisAlignment: MainAxisAlignment.center, children: widgets.reversed.toList());
    }

    return Row(mainAxisAlignment: MainAxisAlignment.center, children: widgets);
  }

  double _getHeight() {
    switch (size) {
      case ButtonSize.small:
        return AppSpacing.buttonSmall;
      case ButtonSize.medium:
        return AppSpacing.buttonMedium;
      case ButtonSize.large:
        return AppSpacing.buttonLarge;
    }
  }
}

enum ButtonVariant { primary, secondary, tertiary }
enum ButtonSize { small, medium, large }
enum IconPosition { left, right }
