from backend.models import Books,Users
from rest_framework import serializers

class BookSerializer(serializers.Serializer):
    ISBNNo = serializers.IntegerField()
    Title = serializers.CharField()
    Quantity = serializers.IntegerField()
    Price = serializers.FloatField()

    def create(self,validated_data):
        return Books.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.ISBNNo = validated_data.get("ISBNNo",instance.ISBNNo)
        instance.Title = validated_data.get("Title",instance.Title)
        instance.Quantiy = validated_data.get("Quantity",instance.Quantity)
        instance.ISBNNo = validated_data.get("ISBNNo",instance.ISBNNo)
        instance.save()
        return instance


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Users
        fields = ['UserID','UserName','UserPassword',"UserTypeSeller"]