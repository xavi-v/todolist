from django.urls import path

from .views import index, task_all, task_toggle, task_edit

urlpatterns = [
    path("", index),
    path("task.json", task_all),
    path("task/<int:task_id>/toggle.json", task_toggle),
	path("task/<int:task_id>/edit.json", task_edit),
]