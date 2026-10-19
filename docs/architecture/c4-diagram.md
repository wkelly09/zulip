# Diagrama de contexto — C4 nivel 1

El diagrama representa a Zulip, sus usuarios y los servicios externos
que pueden participar según la configuración del despliegue.
Los servicios externos no forman parte de las mejoras propuestas.

```mermaid
C4Context
      title System Context diagram for Zulip

      Person(member, "Miembro", "Miembro de la organización de trabajo.")
      Person(admin, "Administrador", "Administrador de la organización de trabajo")

      %% 2. Core System
      System(zulip, "Zulip", "Comunicación por canales, temas y mensajes privados.")

      %% 3. External Systems
      System_Ext(smtp, "Sistema de correo electrónico", "Notificaciones y correo")
      System_Ext(auth, "Proveedor de identidad", "Autenticación externa")
      System_Ext(other, "Servicios e integraciones externas", "Webhooks, bots, APIs y aplicaciones de terceros")
      SystemDb_Ext(file, "Servicio de almacenamiento", "Maneja archivos adjuntos.")

     %% Relationships
      Rel(member, zulip, "Lee y envía mensajes, navega y busca información")
      Rel(admin, zulip, "Gestiona usuarios, permisos, configuraciones")
      BiRel(smtp, zulip, "Envía y recibe correo")
      BiRel(file, zulip, "Guarda y recupera archivos")
      Rel(zulip, auth, "Solicita autenticación")
      Rel(zulip, other, "Intercambia eventos y mensajes")

      UpdateRelStyle(member, zulip, $offsetY="-30", $offsetX="-200")
      UpdateRelStyle(admin, zulip, $offsetX="-80")
      UpdateRelStyle(smtp, zulip, $offsetX="-50", $offsetY="20")
      UpdateRelStyle(file, zulip, $offsetX="-50", $offsetY="100")

      UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="1")

```

# Diagrama de componentes — C4 nivel 2

El diagrama representa los componentes que forman parte de Zulip. La cual hace referencia a lo expuesto en [su documentación](https://zulip.readthedocs.io/en/latest/overview/architecture-overview.html#components)

```mermaid
C4Container
    title Component diagram for Zulip

    Person(user, "User", "Participates in team conversations")

    System_Boundary(zulip, "Zulip Collaboration Platform") {
        Container(web, "Web Application", "JavaScript / TypeScript", "Browser-based chat interface")
        Container(mobile, "Mobile Application", "Flutter", "iOS and Android client")
        Container(nginx, "NGINX", "Web server / reverse proxy", "Serves static files and routes requests")
        Container(django, "Django Application Server", "Python / Django", "Business logic, authentication and APIs")
        Container(tornado, "Tornado Event Server", "Python / Tornado", "Real-time event delivery")
        Container(workers, "Background Workers", "Python", "Processes asynchronous tasks and notifications")
        ContainerDb(postgres, "PostgreSQL", "Relational database", "Persistent application data")
        ContainerDb(memcached, "Memcached", "Cache", "Caches frequently accessed data")
        ContainerDb(redis, "Redis", "In-memory data store", "Rate limiting and temporary data")
        ContainerQueue(rabbitmq, "RabbitMQ", "Message broker", "Asynchronous jobs and event distribution")
    }

    System_Ext(email, "Email Service", "Sends email notifications")
    System_Ext(push, "Push Notification Services", "Sends mobile notifications")

    Rel(user, web, "Uses", "HTTPS")
    Rel(user, mobile, "Uses", "HTTPS")
    Rel(web, nginx, "Sends requests", "HTTPS")
    Rel(mobile, nginx, "Calls APIs", "HTTPS")
    Rel(nginx, django, "Routes HTTP requests", "uWSGI")
    Rel(nginx, tornado, "Routes real-time requests", "HTTP / WebSocket")
    Rel(nginx, web, "Serves static assets", "HTTPS")
    Rel(django, postgres, "Reads and writes", "SQL")
    Rel(django, memcached, "Caches objects", "Cache protocol")
    Rel(django, redis, "Uses temporary data", "Redis protocol")
    Rel(django, rabbitmq, "Publishes jobs and events", "AMQP")
    Rel(workers, rabbitmq, "Consumes jobs", "AMQP")
    Rel(workers, postgres, "Reads and writes", "SQL")
    Rel(tornado, rabbitmq, "Receives real-time events", "AMQP")
    Rel(workers, email, "Sends notifications", "SMTP / API")
    Rel(workers, push, "Sends push notifications", "API")


```