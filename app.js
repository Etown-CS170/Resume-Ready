document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('user-input');
    const resumePreview = document.getElementById('resume-preview');
    const sendButton = document.getElementById('send-button');
    
    async function generateAIResponse(prompt) {
        try {
            console.log('Attempting to connect to LM Studio...');
            console.log('Sending prompt:', prompt);
            
            const requestBody = {
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional resume improvement assistant. Provide clear, specific suggestions to enhance resume content.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                model: 'llama-3.2-3b-instruct',
                temperature: 0.7,
                max_tokens: -1,
                stream: false
            };
            
            console.log('Request body:', JSON.stringify(requestBody, null, 2));
            
            const response = await fetch('http://localhost:1234/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response not OK:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText
                });
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Response received:', data);
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Detailed error:', error);
            return `Error communicating with AI service: ${error.message}`;
        }
    }

    sendButton.addEventListener('click', async function() {
        sendButton.disabled = true;
        sendButton.textContent = 'Processing...';
        
        resumePreview.textContent = 'Generating response...';
        
        const prompt = `Please help me improve this resume content:

${userInput.value}

Please provide specific suggestions for improvement while maintaining a professional tone.`;

        const aiResponse = await generateAIResponse(prompt);
        
        resumePreview.textContent = aiResponse;
        
        sendButton.disabled = false;
        sendButton.textContent = 'Send to AI';
    });
});
