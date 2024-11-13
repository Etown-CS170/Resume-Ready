console.log(window.docx); 
document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('user-input');
    const resumePreview = document.getElementById('resume-preview');
    const sendButton = document.getElementById('send-button');
    const downloadButton = document.getElementById('download-button');
    
    async function generateAIResponse(prompt) {
        try {
            const requestBody = {
                messages: [
                    { role: 'system', content: 'You are a professional resume improvement assistant.' },
                    { role: 'user', content: prompt }
                ],
                model: 'llama-3.2-3b-instruct',
                temperature: 0.7,
                max_tokens: -1,
                stream: false
            };
            
            const response = await fetch('http://localhost:1234/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error:', error);
            return `Error communicating with AI service: ${error.message}`;
        }
    }

    sendButton.addEventListener('click', async function() {
        sendButton.disabled = true;
        sendButton.textContent = 'Processing...';
        
        resumePreview.textContent = 'Generating response...';
        
        const prompt = `Please help me improve this resume content:\n\n${userInput.value}\n\nPlease provide specific suggestions for improvement.`;
        const aiResponse = await generateAIResponse(prompt);
        
        resumePreview.textContent = aiResponse;
        
        sendButton.disabled = false;
        sendButton.textContent = 'Send to AI';
    });

    downloadButton.addEventListener('click', function() {
        console.log("Download button clicked");
        const { Document, Packer, Paragraph, TextRun } = window.docx;

        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun(resumePreview.textContent)
                            ]
                        })
                    ]
                }
            ]
        });

        Packer.toBlob(doc).then(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Resume.docx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    });
});
