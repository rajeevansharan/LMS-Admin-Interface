package lk.slpa.mpma.backend.service;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

@Service
public class ImageService {
  private final String COURSE_DIR = "uploads/courses/";

  public Resource getCourseImage(String filename) throws IOException {
    Path filePath = Paths.get(COURSE_DIR + filename);
    Resource resource = new UrlResource(filePath.toUri());
    if (resource.exists() && resource.isReadable()) {
      return resource;
    }
    return null;
  }
}
