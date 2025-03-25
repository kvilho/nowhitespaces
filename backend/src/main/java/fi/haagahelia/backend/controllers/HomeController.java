package fi.haagahelia.backend.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class HomeController {

    @RequestMapping(value = "/**", method = RequestMethod.OPTIONS)
    public void handlePreflight() {
        // Do nothing, just to allow preflight requests
    }
}

