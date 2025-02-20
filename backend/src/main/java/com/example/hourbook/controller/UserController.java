import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    // ... rest of your controller code
} 