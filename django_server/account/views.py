from rest_framework import viewsets, mixins
from .models import User
from .serializers import UserSerializer, UserCreateSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from rest_framework.permissions import AllowAny
from .pagination import CustomPageNumberPagination
class UserViewSet(
        mixins.CreateModelMixin,
        mixins.RetrieveModelMixin,
        viewsets.GenericViewSet
    ):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = CustomPageNumberPagination

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return super().get_permissions()
    def create(self, request, *args, **kwargs):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                if "username" in str(e):
                    raise ValidationError({"username": "A user with this username already exists."})
                raise  # Re-raise other integrity errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=False, methods=['get'])
    def me(self, request, pk=None):
        user = request.user
        # Prepare comprehensive user data
        response_data = {
            "id": str(user.id),
            "name": user.name,
            "username": user.username,
            "is_staff": user.is_staff,
            "date_joined": user.date_joined.isoformat(),
        }

        return JsonResponse(response_data)
    