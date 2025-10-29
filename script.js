const HF_API_TOKEN = "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";
const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-video-diffusion-img2vid";

function convertToVideo() {
    const fileInput = document.getElementById('imageUpload');
    const resultDiv = document.getElementById('result');
    const convertBtn = document.getElementById('convertBtn');
    
    if (!fileInput.files[0]) {
        alert('দয়া করে একটি ইমেজ সিলেক্ট করুন!');
        return;
    }

    convertBtn.disabled = true;
    convertBtn.textContent = 'ভিডিও তৈরি হচ্ছে...';
    resultDiv.innerHTML = '<p>ভিডিও তৈরি হচ্ছে, অপেক্ষা করুন...</p>';

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${HF_API_TOKEN}`,
            'Content-Type': 'application/octet-stream'
        },
        body: fileInput.files[0]
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('API Error: ' + response.status);
        }
        return response.blob();
    })
    .then(videoBlob => {
        const videoUrl = URL.createObjectURL(videoBlob);
        const videoName = fileInput.files[0].name.replace(/\.[^/.]+$/, "") + '.mp4';
        
        resultDiv.innerHTML = `
            <div style="text-align: center;">
                <p>✅ ভিডিও তৈরি সম্পূর্ণ!</p>
                <video controls style="width: 100%; max-width: 400px; margin: 10px 0;">
                    <source src="${videoUrl}" type="video/mp4">
                </video>
                <br>
                <button onclick="downloadVideo('${videoUrl}', '${videoName}')" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    ভিডিও ডাউনলোড করুন
                </button>
                <p style="margin-top: 10px; font-size: 14px; color: #666;">ফাইল: ${videoName}</p>
            </div>
        `;
        
        convertBtn.disabled = false;
        convertBtn.textContent = 'ভিডিও বানান';
    })
    .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = '<p>⚠️ ভিডিও তৈরি ব্যর্থ! পরে আবার চেষ্টা করুন।</p>';
        convertBtn.disabled = false;
        convertBtn.textContent = 'ভিডিও বানান';
    });
}

function downloadVideo(videoUrl, fileName) {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

document.getElementById('imageUpload').addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name;
    if (fileName) {
        document.querySelector('.upload-btn').textContent = `সিলেক্টেড: ${fileName}`;
    }
});
