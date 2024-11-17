document.addEventListener('DOMContentLoaded', function () {
    const userInput = document.getElementById('user-input');
    const resumePreview = document.getElementById('resume-preview');
    const sendButton = document.getElementById('send-button');
    const downloadButton = document.getElementById('download-button');

    function parseSections(inputText) {
        const lines = inputText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        const name = lines[0] || 'No name provided';
        const contact = lines[1] || 'No contact information provided';
        const linkedin = lines[2] || 'No LinkedIn profile provided';
        const addressPhoneEmail = contact.split('|').map(item => item.trim());
        const address = addressPhoneEmail[0] || 'No address provided';
        const phone = addressPhoneEmail[1] || 'No phone provided';
        const email = addressPhoneEmail[2] || 'No email provided';
        const education = lines[3] || 'No education provided';
        const workExperience = lines[4] || 'No work experience provided';
        const relatedProjects = lines[5] || 'No related projects provided';
        const certifications = lines[6] || 'No certifications provided';
        const skills = lines[7] || 'No skills provided';

        return {
            name,
            linkedin,
            address,
            phone,
            email,
            education,
            workExperience,
            relatedProjects,
            certifications,
            skills
        };
    }

    function generateResumeContent(sections) {
        const resumeContent = `
            <div style="text-align: center;">
                <h1><strong>${sections.name}</strong></h1>
                <p>${sections.address} | ${sections.phone} | ${sections.email}</p>
                <p>LinkedIn: ${sections.linkedin}</p>
            </div>
            <div style="text-align: left;">
                <div class="resume-section">
                    <strong>Education</strong>
                    <hr>
                    <ul>
                        <li>${sections.education}</li>
                    </ul>
                </div>
                <div class="resume-section">
                    <strong>Work Experience</strong>
                    <hr>
                    <ul>
                        <li>${sections.workExperience}</li>
                    </ul>
                </div>
                <div class="resume-section">
                    <strong>Related Projects</strong>
                    <hr>
                    <ul>
                        <li>${sections.relatedProjects}</li>
                    </ul>
                </div>
                <div class="resume-section">
                    <strong>Certifications</strong>
                    <hr>
                    <ul>
                        <li>${sections.certifications}</li>
                    </ul>
                </div>
                <div class="resume-section">
                    <strong>Skills</strong>
                    <hr>
                    <ul>
                        <li>${sections.skills}</li>
                    </ul>
                </div>
            </div>
        `;
        return resumeContent;
    }

    sendButton.addEventListener('click', function () {
        sendButton.disabled = true;
        sendButton.textContent = 'Processing...';
        resumePreview.innerHTML = 'Generating resume...';

        const inputText = userInput.value;
        const sections = parseSections(inputText);
        const resumeContent = generateResumeContent(sections);

        resumePreview.innerHTML = resumeContent;

        sendButton.disabled = false;
        sendButton.textContent = 'Generate Resume';
    });

    downloadButton.addEventListener('click', function () {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        const content = resumePreview.innerHTML;

        pdf.html(resumePreview, {
            callback: function (doc) {
                doc.save('Resume.pdf');
            },
            margin: [10, 10, 10, 10],
            autoPaging: true
        });
    });
});


