package com.jobhub.service;

import com.jobhub.dto.message.ConversationResponse;
import com.jobhub.dto.message.MessageRequest;
import com.jobhub.dto.message.MessageResponse;
import com.jobhub.entity.Message;
import com.jobhub.entity.User;
import com.jobhub.exception.ResourceNotFoundException;
import com.jobhub.exception.AccessDeniedException;
import com.jobhub.repository.MessageRepository;
import com.jobhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    public MessageResponse sendMessage(MessageRequest request, String senderEmail) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));

        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(request.getContent());
        message.setIsRead(false);

        Message savedMessage = messageRepository.save(message);
        return convertToResponse(savedMessage);
    }

    public List<ConversationResponse> getConversations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<User> conversationPartners = messageRepository.findConversationPartners(user);
        
        return conversationPartners.stream()
                .map(partner -> {
                    ConversationResponse response = new ConversationResponse();
                    response.setUserId(partner.getId());
                    response.setUserName(partner.getFirstName() + " " + partner.getLastName());
                    response.setUserProfilePicture(partner.getProfilePicture());
                    // Add logic to get last message and unread count
                    return response;
                })
                .collect(Collectors.toList());
    }

    public List<MessageResponse> getConversation(Long userId, String userEmail) {
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        User otherUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Message> messages = messageRepository.findConversationBetweenUsers(currentUser, otherUser);
        return messages.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public void markAsRead(Long messageId, String userEmail) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!message.getReceiver().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can only mark your own messages as read");
        }

        message.setIsRead(true);
        message.setReadAt(LocalDateTime.now());
        messageRepository.save(message);
    }

    public List<MessageResponse> getUnreadMessages(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Message> unreadMessages = messageRepository.findUnreadMessages(user);
        return unreadMessages.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public long getUnreadMessageCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return messageRepository.countUnreadMessages(user);
    }

    public void deleteMessage(Long messageId, String userEmail) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!message.getSender().getId().equals(user.getId()) && 
            !message.getReceiver().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can only delete your own messages");
        }

        messageRepository.delete(message);
    }

    private MessageResponse convertToResponse(Message message) {
        MessageResponse response = new MessageResponse();
        response.setId(message.getId());
        response.setSenderId(message.getSender().getId());
        response.setSenderName(message.getSender().getFirstName() + " " + message.getSender().getLastName());
        response.setReceiverId(message.getReceiver().getId());
        response.setReceiverName(message.getReceiver().getFirstName() + " " + message.getReceiver().getLastName());
        response.setContent(message.getContent());
        response.setIsRead(message.getIsRead());
        response.setSentAt(message.getSentAt());
        response.setReadAt(message.getReadAt());
        return response;
    }
}
