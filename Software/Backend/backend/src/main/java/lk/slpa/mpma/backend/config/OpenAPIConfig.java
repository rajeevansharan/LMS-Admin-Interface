package lk.slpa.mpma.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class that defines the OpenAPI documentation for the MPMA API. The OpenAPI
 * specification is a standard for defining RESTful APIs, and this configuration provides
 * information about the API such as the title, version, contact information, and license. It also
 * specifies the server URL for the API in the development environment.
 *
 * <p>The API documentation can be accessed at http://localhost:8080/swagger-ui/index.html after
 * running the application.
 */
@Configuration
public class OpenAPIConfig {

  /**
   * Creates and configures the OpenAPI documentation bean.
   *
   * @return The configured OpenAPI object with server, contact, license, and API info
   */
  @Bean
  public OpenAPI myOpenAPI() {
    Server devServer = new Server();
    devServer.setUrl("http://localhost:8080");
    devServer.setDescription("Server URL in Development environment");

    Contact contact = new Contact();
    contact.setName("MPMA Support");
    contact.setEmail("support@mpma.com");

    // The following is a placeholder for the actual license and its URL.
    License license = new License().name("MIT License").url("https://opensource.org/licenses/MIT");

    Info info =
        new Info()
            .title("MPMA API Documentation")
            .version("1.0")
            .contact(contact)
            .description(
                "This API exposes endpoints for the MPMA (Mahapola Ports and Maritime Academy).")
            .license(license);

    return new OpenAPI().info(info).servers(List.of(devServer));
  }
}
