package lk.slpa.mpma.backend.security;

import java.util.Collection;
import java.util.Collections;
import lk.slpa.mpma.backend.model.Person;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UserDetailsImpl implements UserDetails {
  private final Person person;

  public UserDetailsImpl(Person person) {
    this.person = person;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    // Convert the user role to a Spring Security role
    // Spring Security roles are usually prefixed with "ROLE_"
    return Collections.singletonList(
        new SimpleGrantedAuthority("ROLE_" + person.getUserRole().name()));
  }

  @Override
  public String getPassword() {
    return person.getPassword();
  }

  @Override
  public String getUsername() {
    return person.getUsername();
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

  public Person getPerson() {
    return person;
  }
}
