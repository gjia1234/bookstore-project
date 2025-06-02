from backend.models import Books,Users
from rest_framework import serializers

class BookSerializer(serializers.Serializer):
    ISBNNo = serializers.CharField()
    Title = serializers.CharField()
    Quantity = serializers.IntegerField()
    Price = serializers.FloatField()

    def create(self,validated_data):
        return Books.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.ISBNNo = validated_data.get("ISBNNo",instance.ISBNNo)
        instance.Title = validated_data.get("Title",instance.Title)
        instance.Quantity = validated_data.get("Quantity",instance.Quantity)
        instance.Price = validated_data.get("Price",instance.Price)
        instance.save()
        return instance
    
    def validate_ISBNNo(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("ISBN must contain digits only.")
        if len(value) != 13:
            raise serializers.ValidationError("ISBN must be exactly 13 digits.")
        return value

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Users
        fields = ['UserID','UserName','UserPassword',"UserTypeSeller"]