package com.bookstore.bookstore_backend.services.Impl;

import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service
@Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class SessionTimerService {
    private long startTime;

    public void startTimer() {
        this.startTime = System.currentTimeMillis();
        System.out.println("Session timer started at: " + startTime);
    }

    public long stopTimer() {
        if(startTime == 0) {
            throw new IllegalStateException("Timer was not started.");
        }
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        long durationSeconds = duration / 1000;
        System.out.println("Session timer stopped at: " + endTime + ", duration: " + durationSeconds + " s");
        startTime = 0; // Reset startTime for potential future use
        return durationSeconds;
    }
}
