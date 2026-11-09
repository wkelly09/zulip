# Esquema de contexto — C4 nivel 1

El esquema representa a Zulip, sus usuarios y los servicios externos
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

# Esquema de componentes — C4 nivel 2

El esquema representa los componentes que forman parte de Zulip. La cual hace referencia a lo expuesto en [su documentación](https://zulip.readthedocs.io/en/latest/overview/architecture-overview.html#components)

```mermaid
C4Container
    title Component diagram for Zulip

    Person(user, "Usuario", "Participa en conversaciones de equipo")

    System_Boundary(zulip, "Zulip") {
        Container(web, "Aplicación Web", "JavaScript / TypeScript", "Interfaz de chat")
        Container(mobile, "Aplicación móvil", "Flutter", "Cliente iOS y Android")
        Container(nginx, "NGINX", "Servidor web / proxy", "Archivos estáticos y enruta requests")
        Container(django, "Servidor de Aplicación Django", "Python / Django", "Lógica de negocio, autenticación y APIs")
        Container(tornado, "Servidor de Eventos Tornado", "Python / Tornado", "Entrega de eventos en tiempo real")
        Container(workers, "Background Workers", "Python", "Procesa tareas asíncronas y notificaciones")
        ContainerDb(postgres, "PostgreSQL", "Base de datos Relacional", "Información persistente de la aplicación")
        ContainerDb(memcached, "Memcached", "Cache", "Caché de data accesada frecuentemente")
        ContainerDb(redis, "Redis", "Almacenamiento de datos en memoria", "Información temporal y Rate Limit")
        ContainerQueue(rabbitmq, "RabbitMQ", "Broker de mensajes", "Distribución de eventos y jobs asíncronos")
    }

    System_Ext(email, "Sistema de correo electrónico", "Notificaciones y correo")
    System_Ext(push, "Servicio de notificaciones push", "Sends mobile notifications")

    Rel(user, web, "Usa", "HTTPS")
    Rel(user, mobile, "Usa", "HTTPS")
    Rel(web, nginx, "Envía requests", "HTTPS")
    Rel(mobile, nginx, "Invoca APIs", "HTTPS")
    Rel(nginx, django, "Enruta HTTP requests", "uWSGI")
    Rel(nginx, tornado, "Enruta requests en tiempo real", "HTTP / WebSocket")
    Rel(nginx, web, "Sirve recursos estáticos", "HTTPS")
    Rel(django, postgres, "Lee y escribe", "SQL")
    Rel(django, memcached, "Almacena objetos en caché", "Protocolo de caché")
    Rel(django, redis, "Usa datos temporales", "Protocolo de Redis")
    Rel(django, rabbitmq, "Publica jobs y eventos", "AMQP")
    Rel(workers, rabbitmq, "Consume jobs", "AMQP")
    Rel(workers, postgres, "Lee y escribe", "SQL")
    Rel(tornado, rabbitmq, "Recibe eventos en tiempo real", "AMQP")
    Rel(workers, email, "Envía notificaciones", "SMTP / API")
    Rel(workers, push, "Envía notificaciones push", "API")


```