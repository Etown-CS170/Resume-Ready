document.addEventListener('DOMContentLoaded', function () {
    // Get references to HTML elements
    const userInput = document.getElementById('user-input');
    const resumePreview = document.getElementById('resume-preview');
    const sendButton = document.getElementById('send-button');
    const downloadButton = document.getElementById('download-button');

    // Function to generate resume using the Llama-based service
    async function generateResumeUsingLlama(inputText) {
        try {
            // Sends a POST request to the local server with the resume formatting request
            const response = await fetch('http://localhost:1234/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: `You are a helpful assistant that creates professional resumes. 
                            Format the response in pure HTML with the following specifications.
                            Use only HTML tags and avoid any Markdown syntax.
                            (If something is not provided, please still format it in the correct way. 
                            Everything must be on its appropriate line. 
                            You can just get rid of that section if it's not there, or leave it blank if it's on the first 3 lines.):
                            - Wrap everything in <div style="font-family: 'Aptos', sans-serif;">
                            - First line: <div style="text-align: center; font-size: 18pt; font-weight: bold;">[Full name]</div>
                            - Second line: <div style="text-align: center; font-size: 12pt;">[City, State, Zipcode | Phone | Email]</div>
                            - Third line: <div style="text-align: center; font-size: 12pt;">LinkedIn: [URL]</div>
                            - Add <br> after LinkedIn
                            - Rest of content should use <div style="text-align: left; font-size: 12pt;">
                            - For sections, use:
                              1. <div class="section"><strong>Education</strong></div><hr>
                              2. <div class="section"><strong>Work Experience</strong></div><hr>
                              3. <div class="section"><strong>Related Projects</strong></div><hr>
                              4. <div class="section"><strong>Certificates</strong></div><hr>
                              5. <div class="section"><strong>Skills</strong></div><hr>
                            - Use <ul> and <li> for bullet points
                            - Add <br> between each section`
                        },
                        {
                            role: "user", // User's input
                            content: inputText
                        }
                    ],
                    stream: false,
                    max_tokens: 2000,
                    temperature: 0.7
                }),
            });

            // Parse the JSON response
            const data = await response.json();
            return data.choices[0].message.content || 'No resume data generated.';
        } catch (error) {
            console.error('Error generating resume:', error);
            // Return an error message if the fetch request fails
            return 'Error generating resume. Make sure LM Studio is running on port 1234.';
        }
    }

    // Event listener for the "Generate Resume" button
    sendButton.addEventListener('click', async function () {
        // Disable the button and update text to show processing state
        sendButton.disabled = true;
        sendButton.textContent = 'Processing...';
        resumePreview.innerHTML = 'Generating resume...';

        // Get user input and generate the resume
        const inputText = userInput.value;
        const resumeContent = await generateResumeUsingLlama(inputText);

        // Display the generated resume in the preview area
        resumePreview.innerHTML = resumeContent;

        // Re-enable the button and reset the text
        sendButton.disabled = false;
        sendButton.textContent = 'Generate Resume';
    });

    // Event listener for the "Download as PDF" button
    downloadButton.addEventListener('click', function () {
        const doc = new jspdf.jsPDF({
            unit: 'pt',
            format: 'letter'
        });

        const element = resumePreview;

        // Convert the resume preview to a canvas and then add it to the PDF
        html2canvas(element).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight); // Add the image to the PDF
            doc.save('Resume.pdf'); // Save the PDF file
        });
    });

});
