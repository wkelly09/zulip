# Diagrama de contexto — C4 nivel 1

El diagrama representa a Zulip, sus usuarios y los servicios externos
que pueden participar según la configuración del despliegue.
Los servicios externos no forman parte de las mejoras propuestas.

```mermaid
flowchart TB
    member["Miembro de la organización<br/>[Persona]<br/>Lee y envía mensajes,<br/>navega y busca información"]

    admin["Administrador de la organización<br/>[Persona]<br/>Gestiona usuarios, permisos<br/>y configuración"]

    zulip["Zulip<br/>[Sistema de software]<br/>Comunicación por canales,<br/>temas y mensajes privados"]

    auth["Proveedor de identidad<br/>[Sistema externo opcional]<br/>Autenticación externa"]

    email["Servicio de correo electrónico<br/>[Sistema externo]<br/>Notificaciones y correo"]

    integrations["Servicios e integraciones<br/>[Sistema externo opcional]<br/>Webhooks, bots y APIs"]

    storage["Servicio de almacenamiento<br/>[Sistema externo opcional]<br/>Archivos adjuntos"]

    member -->|"Lee y envía mensajes; navega y busca"| zulip
    admin -->|"Gestiona usuarios y configuración"| zulip
    zulip -->|"Solicita autenticación"| auth
    zulip -->|"Envía y recibe correo"| email
    zulip <-->|"Intercambia eventos y mensajes"| integrations
    zulip -->|"Guarda y recupera archivos"| storage
```