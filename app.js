document.addEventListener('DOMContentLoaded', function () {
    const userInput = document.getElementById('user-input');
    const resumePreview = document.getElementById('resume-preview');
    const sendButton = document.getElementById('send-button');
    const downloadButton = document.getElementById('download-button');

    async function generateResumeUsingLlama(inputText) {
        try {

            const response = await fetch('http://localhost:1234/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: `You are a helpful assistant that creates professional resumes. Format the response in HTML with the following specifications. Do not use markdown format!
                            (If something is not provided, please still format it in the correct way. Everything must be on its appropriate line.):
                            - Use Aptos font for the entire document
                            - First line: Full name (First and Last), centered, 18pt font, bold
                            - Second line: centered, 12pt font, format: "City, State, Zipcode | Phone | Email"
                            - Third line: centered, 12pt font, format: "LinkedIn: [URL]", not a hyperlink
                            - Add line break after LinkedIn
                            - Rest of content is left-aligned, 12pt font
                            - Include the following sections in order with 12pt font (each with a line underneath):
                              1. Education (with bullet points)
                              2. Work Experience (with bullet points)
                              3. Related Projects (with bullet points)
                              4. Certificates (with bullet points)
                              5. Skills (with bullet points)
                            - Add line break between each section
                            Format all of this in clean, semantic HTML with appropriate styling.`
                        },
                        {
                            role: "user",
                            content: inputText
                        }
                    ],
                    stream: false,
                    max_tokens: 2000,
                    temperature: 0.7
                }),
            });

            const data = await response.json();
            return data.choices[0].message.content || 'No resume data generated.';
        } catch (error) {
            console.error('Error generating resume:', error);
            return 'Error generating resume. Make sure LM Studio is running on port 1234.';
        }
    }

    sendButton.addEventListener('click', async function () {
        sendButton.disabled = true;
        sendButton.textContent = 'Processing...';
        resumePreview.innerHTML = 'Generating resume...';

        const inputText = userInput.value;
        const resumeContent = await generateResumeUsingLlama(inputText);

        resumePreview.innerHTML = resumeContent;

        sendButton.disabled = false;
        sendButton.textContent = 'Generate Resume';
    });

    downloadButton.addEventListener('click', function () {
        const doc = new jspdf.jsPDF({
            unit: 'pt',
            format: 'letter'
        });

        const element = resumePreview;

        html2canvas(element).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            doc.save('Resume.pdf');
        });
    });
});


