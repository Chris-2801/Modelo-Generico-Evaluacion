from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.core.mail import send_mail

@receiver(post_save, sender=User)
def notify_password_change(sender, instance, **kwargs):
    if instance._password:  # solo cuando cambia
        # Envía correo al superuser
        send_mail(
            'Contraseña cambiada',
            f'El usuario {instance.username} ha cambiado su contraseña.',
            'admin@tuapp.com',
            ['superuser@tuapp.com'],
            fail_silently=True,
        )