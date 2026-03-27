document.addEventListener('DOMContentLoaded', function() {
    const wakeupTimeInput = document.getElementById('wakeup-time');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');
    const sleepTimesDiv = document.getElementById('sleep-times');
    const useCurrentTimeBtn = document.getElementById('use-current-time');
    
    // Элементы калькулятора ИМТ
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const calculateBmiBtn = document.getElementById('calculate-bmi-btn');
    const bmiResultsDiv = document.getElementById('bmi-results');
    const bmiValueDiv = document.getElementById('bmi-value');
    const bmiCategoryDiv = document.getElementById('bmi-category');
    const bmiDescriptionDiv = document.getElementById('bmi-description');
    
    // Элементы вкладок
    const sleepTab = document.getElementById('sleep-tab');
    const bmiTab = document.getElementById('bmi-tab');
    const notesTab = document.getElementById('notes-tab');
    const sleepCalculator = document.getElementById('sleep-calculator');
    const bmiCalculator = document.getElementById('bmi-calculator');
    const notesCalculator = document.getElementById('notes-calculator');
    
    // Элементы заметок
    const noteText = document.getElementById('note-text');
    const noteType = document.getElementById('note-type');
    const addNoteBtn = document.getElementById('add-note-btn');
    const dateTimeContainer = document.getElementById('date-time-container');
    const noteDate = document.getElementById('note-date');
    const noteTime = document.getElementById('note-time');
    const todayNotesDiv = document.getElementById('today-notes');
    const somedayNotesDiv = document.getElementById('someday-notes');
    const ideasNotesDiv = document.getElementById('ideas-notes');
    const diaryNotesDiv = document.getElementById('diary-notes');
    
    // Загрузка заметок из localStorage
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    
    // Установить текущее время + 8 часов (типичное время сна)
    function setDefaultTime() {
        const now = new Date();
        now.setHours(now.getHours() + 8);
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        wakeupTimeInput.value = `${hours}:${minutes}`;
    }

    setDefaultTime();

    // Кнопка "Сейчас"
    useCurrentTimeBtn.addEventListener('click', function() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        wakeupTimeInput.value = `${hours}:${minutes}`;
    });

    // Расчет времени сна
    calculateBtn.addEventListener('click', function() {
        const wakeupTime = wakeupTimeInput.value;
        if (!wakeupTime) {
            alert('Пожалуйста, введите время пробуждения');
            return;
        }

        const [hours, minutes] = wakeupTime.split(':').map(Number);
        const wakeupDate = new Date();
        wakeupDate.setHours(hours, minutes, 0, 0);

        // Если время уже прошло сегодня, установим на завтра
        if (wakeupDate < new Date()) {
            wakeupDate.setDate(wakeupDate.getDate() + 1);
        }

        sleepTimesDiv.innerHTML = '';
        
        // Создаем 6 вариантов времени сна (4-6 циклов)
        for (let cycles = 6; cycles >= 4; cycles--) {
            const sleepTime = new Date(wakeupDate);
            sleepTime.setMinutes(sleepTime.getMinutes() - (cycles * 90 + 15)); // 15 минут на засыпание
            
            const sleepTimeStr = sleepTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const sleepHours = (cycles * 90) / 60;
            
            const sleepTimeElement = document.createElement('div');
            sleepTimeElement.className = 'sleep-time bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg p-4 transition-all duration-300 cursor-pointer border border-white border-opacity-20';
            sleepTimeElement.innerHTML = `
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-2xl font-bold">${sleepTimeStr}</div>
                        <div class="text-sm opacity-80">${cycles} цикла сна (${sleepHours} часов)</div>
                    </div>
                    <div class="text-3xl opacity-70">
                        ${cycles === 5 ? '<i class="fas fa-star text-yellow-300"></i>' : '<i class="fas fa-moon"></i>'}
                    </div>
                </div>
            `;
            
            // Подсветка оптимального варианта (5 циклов)
            if (cycles === 5) {
                sleepTimeElement.classList.add('bg-opacity-20', 'border-purple-300');
            }
            
            sleepTimesDiv.appendChild(sleepTimeElement);
        }

        resultsDiv.classList.remove('hidden');
        
        // Прокрутка к результатам
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Функция переключения вкладок (обновленная для 3 вкладок)
    function switchTab(showTabId, hideTab1Id, hideTab2Id, activeTabBtn, inactiveTabBtn1, inactiveTabBtn2) {
        document.getElementById(showTabId).classList.remove('hidden');
        document.getElementById(hideTab1Id).classList.add('hidden');
        document.getElementById(hideTab2Id).classList.add('hidden');
        
        activeTabBtn.classList.add('active-tab');
        inactiveTabBtn1.classList.remove('active-tab');
        inactiveTabBtn2.classList.remove('active-tab');
    }
    
    // Обработчики вкладок
    sleepTab.addEventListener('click', function() {
        switchTab('sleep-calculator', 'bmi-calculator', 'notes-calculator', sleepTab, bmiTab, notesTab);
    });
    
    bmiTab.addEventListener('click', function() {
        switchTab('bmi-calculator', 'sleep-calculator', 'notes-calculator', bmiTab, sleepTab, notesTab);
    });
    
    notesTab.addEventListener('click', function() {
        switchTab('notes-calculator', 'sleep-calculator', 'bmi-calculator', notesTab, sleepTab, bmiTab);
        renderNotes();
    });
    
    // Расчет ИМТ
    calculateBmiBtn.addEventListener('click', function() {
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);
        
        if (!height || !weight || height <= 0 || weight <= 0) {
            alert('Пожалуйста, введите корректные значения роста и веса');
            return;
        }
        
        // Преобразование роста из см в м
        const heightInMeters = height / 100;
        
        // Расчет ИМТ
        const bmi = weight / (heightInMeters * heightInMeters);
        
        // Определение категории
        let category = '';
        let description = '';
        
        if (bmi < 18.5) {
            category = 'Недостаточный вес';
            description = 'Возможные риски для здоровья. Рекомендуется проконсультироваться с врачом.';
        } else if (bmi >= 18.5 && bmi < 25) {
            category = 'Нормальный вес';
            description = 'Отличный результат! Так держать для поддержания здоровья.';
        } else if (bmi >= 25 && bmi < 30) {
            category = 'Избыточный вес';
            description = 'Рекомендуется обратить внимание на питание и физическую активность.';
        } else {
            category = 'Ожирение';
            description = 'Важно проконсультироваться с врачом для составления плана по снижению веса.';
        }
        
        // Отображение результатов
        bmiValueDiv.textContent = bmi.toFixed(1);
        bmiCategoryDiv.textContent = category;
        bmiDescriptionDiv.textContent = description;
        
        // Показать результаты
        bmiResultsDiv.classList.remove('hidden');
        
        // Прокрутка к результатам
        bmiResultsDiv.scrollIntoView({ behavior: 'smooth' });
    });
    
    // === ФУНКЦИИ ДЛЯ ЗАМЕТОК ===
    
    // Показывать поля даты/времени только для типа "Ежедневник"
    noteType.addEventListener('change', function() {
        if (this.value === 'diary') {
            dateTimeContainer.classList.remove('hidden');
        } else {
            dateTimeContainer.classList.add('hidden');
            noteDate.value = '';
            noteTime.value = '';
        }
    });
    
    // Добавление заметки
    addNoteBtn.addEventListener('click', function() {
        const text = noteText.value.trim();
        if (!text) {
            alert('Введите текст заметки');
            return;
        }
        
        const type = noteType.value;
        const newNote = {
            id: Date.now(),
            text: text,
            type: type,
            date: type === 'diary' ? noteDate.value : null,
            time: type === 'diary' ? noteTime.value : null,
            completed: false
        };
        
        notes.push(newNote);
        saveNotes();
        renderNotes();
        
        // Очистка формы
        noteText.value = '';
        noteDate.value = '';
        noteTime.value = '';
        dateTimeContainer.classList.add('hidden');
    });
    
    // Сохранение заметок в localStorage
    function saveNotes() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }
    
    // Удаление заметки
    function deleteNote(id) {
        notes = notes.filter(note => note.id !== id);
        saveNotes();
        renderNotes();
    }
    
    // Перемещение заметки в другой тип
    function moveNote(id, newType) {
        const note = notes.find(n => n.id === id);
        if (note) {
            note.type = newType;
            if (newType !== 'diary') {
                note.date = null;
                note.time = null;
            }
            saveNotes();
            renderNotes();
        }
    }
    
    // Отрисовка всех заметок
    function renderNotes() {
        todayNotesDiv.innerHTML = '';
        somedayNotesDiv.innerHTML = '';
        ideasNotesDiv.innerHTML = '';
        diaryNotesDiv.innerHTML = '';
        
        notes.forEach(note => {
            const noteElement = createNoteElement(note);
            
            if (note.type === 'today') {
                todayNotesDiv.appendChild(noteElement);
            } else if (note.type === 'someday') {
                somedayNotesDiv.appendChild(noteElement);
            } else if (note.type === 'ideas') {
                ideasNotesDiv.appendChild(noteElement);
            } else if (note.type === 'diary') {
                diaryNotesDiv.appendChild(noteElement);
            }
        });
    }
    
    // Создание элемента заметки
    function createNoteElement(note) {
        const div = document.createElement('div');
        div.className = 'bg-white bg-opacity-10 rounded-lg p-3 hover:bg-opacity-20 transition-all duration-300';
        
        let dateTimeHtml = '';
        if (note.date) {
            const dateObj = new Date(note.date);
            const dateStr = dateObj.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
            const timeStr = note.time ? ` в ${note.time}` : '';
            dateTimeHtml = `<div class="text-xs opacity-70 mt-1">📅 ${dateStr}${timeStr}</div>`;
        }
        
        div.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <p class="text-sm">${note.text}</p>
                    ${dateTimeHtml}
                </div>
                <button class="delete-note-btn ml-2 opacity-50 hover:opacity-100 transition" data-id="${note.id}">
                    <i class="fas fa-trash text-xs"></i>
                </button>
            </div>
            <div class="mt-2 flex gap-1 flex-wrap">
                <button class="move-note-btn text-xs px-2 py-1 bg-white bg-opacity-10 rounded hover:bg-opacity-20 transition" data-id="${note.id}" data-type="today">📍</button>
                <button class="move-note-btn text-xs px-2 py-1 bg-white bg-opacity-10 rounded hover:bg-opacity-20 transition" data-id="${note.id}" data-type="someday">📅</button>
                <button class="move-note-btn text-xs px-2 py-1 bg-white bg-opacity-10 rounded hover:bg-opacity-20 transition" data-id="${note.id}" data-type="ideas">💡</button>
                <button class="move-note-btn text-xs px-2 py-1 bg-white bg-opacity-10 rounded hover:bg-opacity-20 transition" data-id="${note.id}" data-type="diary">📖</button>
            </div>
        `;
        
        // Обработчик удаления
        const deleteBtn = div.querySelector('.delete-note-btn');
        deleteBtn.addEventListener('click', function() {
            deleteNote(note.id);
        });
        
        // Обработчики перемещения
        const moveBtns = div.querySelectorAll('.move-note-btn');
        moveBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const newType = this.getAttribute('data-type');
                if (newType !== note.type) {
                    moveNote(note.id, newType);
                }
            });
        });
        
        return div;
    }
    
    // Первоначальная отрисовка заметок при загрузке
    renderNotes();
});