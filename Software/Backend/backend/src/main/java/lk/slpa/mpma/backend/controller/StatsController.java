package lk.slpa.mpma.backend.controller;

import lk.slpa.mpma.backend.dto.StatsDTO;
import lk.slpa.mpma.backend.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

  private final StatsService statsService;

  @GetMapping
  public ResponseEntity<StatsDTO> getStats() {
    StatsDTO stats = statsService.getPlatformStats();
    return ResponseEntity.ok(stats);
  }
}
