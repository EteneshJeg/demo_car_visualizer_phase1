from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id", 
            "name", 
            "username",
            ]
class UserCreateSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'name', 'password1', 'password2']

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError("Passwords must match.")
        return data

    def create(self, validated_data):
        # Remove password2 from the validated data
        validated_data.pop('password2', None)

        # Extract password1 and create user object
        password = validated_data.pop('password1')
        user = User(**validated_data)
        user.set_password(password)  # Hash the password
        user.save()
        return user
