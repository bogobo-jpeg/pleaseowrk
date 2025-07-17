const filesData = [];

function uploadFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;

  input.onchange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    const now = Date.now();

    for (const [index, file] of selectedFiles.entries()) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('https://pleaseowrk.onrender.com/upload', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();

        if (result.url) {
          filesData.push({
            name: result.name,
            size: file.size,
            url: result.url,
            time: now + index
          });
        }
      } catch (err) {
        console.error('Upload failed:', err.message);
  console.error(err.stack); // optional: full error trace
  res.status(500).json({ error: 'Upload failed', details: err.message });
      }
    }

    renderFiles(filesData);
  };

  input.click();
}


function renderFiles(data) {
  const fileList = document.getElementById('list');
  fileList.innerHTML = '';
  data.forEach(file => {
    const fileItem = document.createElement('div');
    fileItem.className = 'file';
    fileItem.innerHTML = `
      <div>
        <strong>${file.name}</strong> - ${(file.size / 1024).toFixed(2)} KB
      </div>
      <a href="${file.url}" download="${file.name}" target="_blank" style="color:white;">Download</a>
    `;
    fileList.appendChild(fileItem);
  });
}

function sortFiles(method) {
  if (method === 'newest') {
    filesData.sort((a, b) => b.time - a.time);
  } else if (method === 'oldest') {
    filesData.sort((a, b) => a.time - b.time);
  } else if (method === 'largest') {
    filesData.sort((a, b) => b.size - a.size);
  }
  renderFiles(filesData);
}

function zip() {
  alert("💀 Still not implemented, but we can do it next.");
}
