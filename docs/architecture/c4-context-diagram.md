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