package com.jobhub.controller;

import com.jobhub.dto.message.MessageRequest;
import com.jobhub.dto.message.MessageResponse;
import com.jobhub.dto.message.ConversationResponse;
import com.jobhub.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@Tag(name = "Messages", description = "Messaging system APIs")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    @Operation(summary = "Send a message")
    public ResponseEntity<MessageResponse> sendMessage(
            @Valid @RequestBody MessageRequest request,
            Authentication authentication) {
        MessageResponse response = messageService.sendMessage(request, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/conversations")
    @Operation(summary = "Get all conversations")
    public ResponseEntity<List<ConversationResponse>> getConversations(Authentication authentication) {
        List<ConversationResponse> response = messageService.getConversations(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/conversation/{userId}")
    @Operation(summary = "Get conversation with specific user")
    public ResponseEntity<List<MessageResponse>> getConversation(
            @PathVariable Long userId,
            Authentication authentication) {
        List<MessageResponse> response = messageService.getConversation(userId, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{messageId}/read")
    @Operation(summary = "Mark message as read")
    public ResponseEntity<String> markAsRead(
            @PathVariable Long messageId,
            Authentication authentication) {
        messageService.markAsRead(messageId, authentication.getName());
        return ResponseEntity.ok("Message marked as read");
    }

    @GetMapping("/unread")
    @Operation(summary = "Get unread messages")
    public ResponseEntity<List<MessageResponse>> getUnreadMessages(Authentication authentication) {
        List<MessageResponse> response = messageService.getUnreadMessages(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread/count")
    @Operation(summary = "Get unread message count")
    public ResponseEntity<Long> getUnreadMessageCount(Authentication authentication) {
        long count = messageService.getUnreadMessageCount(authentication.getName());
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/{messageId}")
    @Operation(summary = "Delete a message")
    public ResponseEntity<String> deleteMessage(
            @PathVariable Long messageId,
            Authentication authentication) {
        messageService.deleteMessage(messageId, authentication.getName());
        return ResponseEntity.ok("Message deleted successfully");
    }
}