class NeighborhoodModel {
  final String id;
  final String name;
  final String? type;

  NeighborhoodModel({
    required this.id,
    required this.name,
    this.type,
  });

  factory NeighborhoodModel.fromJson(Map<String, dynamic> json) {
    return NeighborhoodModel(
      id: json['id'] as String,
      name: json['name'] as String,
      type: json['type'] as String?,
    );
  }
}

class UserModel {
  final String id;
  final String phone;
  final String? username;
  final String? role;
  final int? age;
  final NeighborhoodModel? primaryNeighborhood;

  UserModel({
    required this.id,
    required this.phone,
    this.username,
    this.role,
    this.age,
    this.primaryNeighborhood,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      phone: json['phone'] as String,
      username: json['username'] as String?,
      role: json['role'] as String?,
      age: json['age'] as int?,
      primaryNeighborhood: json['primary_neighborhood'] != null
          ? NeighborhoodModel.fromJson(
              json['primary_neighborhood'] as Map<String, dynamic>)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'phone': phone,
      'username': username,
      'role': role,
      'age': age,
    };
  }
}
