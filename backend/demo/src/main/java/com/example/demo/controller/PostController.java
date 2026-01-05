package com.example.demo.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Post;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostController(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public record CreatePostRequest(String username, String content) {}

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreatePostRequest request) {
        if (request.username() == null || request.username().isBlank() ||
            request.content() == null || request.content().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Username and content required"));
        }
        var userOpt = userRepository.findByUsername(request.username());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User not found"));
        }
        var post = new Post();
        post.setUser(userOpt.get());
        post.setContent(request.content());
        var saved = postRepository.save(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "message", "Post created",
                "postId", saved.getId()
        ));
    }
}
