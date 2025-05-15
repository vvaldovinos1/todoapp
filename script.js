// Mostrar fecha actual
const hoy = new Date();
const dia = hoy.getDate();
const mes = hoy.getMonth() + 1;
const anio = hoy.getFullYear();
const fechaFormateada = `${dia}/${mes}/${anio}`;
document.getElementById('fecha').textContent = fechaFormateada;

// Elementos
const metaInput = document.getElementById('metaInput');
const addMetaBtn = document.getElementById('addMetaBtn');
const metaList = document.getElementById('metaList');

const objectiveInput = document.getElementById('objectiveInput');
const addObjectiveBtn = document.getElementById('addObjectiveBtn');
const objectiveList = document.getElementById('objectiveList');

let metas = [];
let selectedMetaId = null;

function saveData() {
  localStorage.setItem('metas', JSON.stringify(metas));
}

function loadData() {
  const data = localStorage.getItem('metas');
  if (data) {
    metas = JSON.parse(data);
  }
}

function renderMetas() {
  metaList.innerHTML = '';
  metas.forEach((meta) => {
    const li = document.createElement('li');
    li.textContent = meta.text;
    li.style.cursor = 'pointer';

    if (meta.id === selectedMetaId) {
      li.style.backgroundColor = '#d0f0d0';
      li.style.fontWeight = 'bold';
    }

    li.onclick = () => {
      selectedMetaId = meta.id;
      renderMetas();
      renderObjectives();
    };

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'edit-btn';
    editBtn.onclick = (e) => {
      e.stopPropagation();
      const newText = prompt('Editar meta:', meta.text);
      if (newText && newText.trim() !== '') {
        meta.text = newText.trim();
        saveData();
        renderMetas();
      }
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      if (confirm('¿Seguro quieres borrar esta meta y todos sus objetivos?')) {
        metas = metas.filter(m => m.id !== meta.id);
        if (selectedMetaId === meta.id) {
          selectedMetaId = null;
          objectiveList.innerHTML = '';
        }
        saveData();
        renderMetas();
      }
    };

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    metaList.appendChild(li);
  });
}

function renderObjectives() {
  objectiveList.innerHTML = '';
  if (!selectedMetaId) return;

  const meta = metas.find(m => m.id === selectedMetaId);
  if (!meta) return;

  meta.objectives.forEach((obj, index) => {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = obj.done;
    checkbox.style.marginRight = '10px';

    checkbox.onchange = () => {
      obj.done = checkbox.checked;
      saveData();
      renderObjectives();
    };

    const span = document.createElement('span');
    span.textContent = obj.text;

    if (obj.done) {
      span.style.textDecoration = 'line-through';
      span.style.color = 'gray';
    }

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'edit-btn';
    editBtn.onclick = (e) => {
      e.stopPropagation();
      const newText = prompt('Editar objetivo:', obj.text);
      if (newText && newText.trim() !== '') {
        obj.text = newText.trim();
        saveData();
        renderObjectives();
      }
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      if (confirm('¿Seguro quieres borrar este objetivo?')) {
        meta.objectives.splice(index, 1);
        saveData();
        renderObjectives();
      }
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    objectiveList.appendChild(li);
  });
}

addMetaBtn.onclick = () => {
  const text = metaInput.value.trim();
  if (text === '') {
    alert('Escribe una meta antes de agregar');
    return;
  }
  const newMeta = {
    id: Date.now().toString(),
    text: text,
    objectives: []
  };
  metas.push(newMeta);
  metaInput.value = '';
  saveData();
  renderMetas();
};

addObjectiveBtn.onclick = () => {
  const text = objectiveInput.value.trim();
  if (text === '') {
    alert('Escribe un objetivo antes de agregar');
    return;
  }
  if (!selectedMetaId) {
    alert('Selecciona primero una meta');
    return;
  }
  const meta = metas.find(m => m.id === selectedMetaId);
  if (!meta) return;

  meta.objectives.push({ text: text, done: false });
  objectiveInput.value = '';
  saveData();
  renderObjectives();
};

loadData();
renderMetas();
renderObjectives();
