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
    const mushtraTab = document.getElementById('mushtra-tab');
    const sleepCalculator = document.getElementById('sleep-calculator');
    const bmiCalculator = document.getElementById('bmi-calculator');
    const notesCalculator = document.getElementById('notes-calculator');
    const mushtraCalculator = document.getElementById('mushtra-calculator');
    
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
    
    // Элементы Списка Муштры
    const mushtraSkillInput = document.getElementById('mushtra-skill');
    const addMushtraSkillBtn = document.getElementById('add-mushtra-skill-btn');
    const mushtraTableContainer = document.getElementById('mushtra-table-container');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const currentMonthDisplay = document.getElementById('current-month-display');
    const resetMushtraBtn = document.getElementById('reset-mushtra-btn');
    const mushtraStatsDiv = document.getElementById('mushtra-stats');
    
    // Загрузка данных из localStorage
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let mushtraData = JSON.parse(localStorage.getItem('mushtraData')) || { skills: [], currentMonth: new Date().getMonth(), currentYear: new Date().getFullYear() };
    
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
    
    // Функция переключения вкладок (обновленная для 4 вкладок)
    function switchTab(showTabId, hideTab1Id, hideTab2Id, hideTab3Id, activeTabBtn, inactiveTabBtn1, inactiveTabBtn2, inactiveTabBtn3) {
        document.getElementById(showTabId).classList.remove('hidden');
        document.getElementById(hideTab1Id).classList.add('hidden');
        document.getElementById(hideTab2Id).classList.add('hidden');
        document.getElementById(hideTab3Id).classList.add('hidden');
        
        activeTabBtn.classList.add('active-tab');
        inactiveTabBtn1.classList.remove('active-tab');
        inactiveTabBtn2.classList.remove('active-tab');
        inactiveTabBtn3.classList.remove('active-tab');
    }
    
    // Обработчики вкладок
    sleepTab.addEventListener('click', function() {
        switchTab('sleep-calculator', 'bmi-calculator', 'notes-calculator', 'mushtra-calculator', sleepTab, bmiTab, notesTab, mushtraTab);
    });
    
    bmiTab.addEventListener('click', function() {
        switchTab('bmi-calculator', 'sleep-calculator', 'notes-calculator', 'mushtra-calculator', bmiTab, sleepTab, notesTab, mushtraTab);
    });
    
    notesTab.addEventListener('click', function() {
        switchTab('notes-calculator', 'sleep-calculator', 'bmi-calculator', 'mushtra-calculator', notesTab, sleepTab, bmiTab, mushtraTab);
        renderNotes();
    });
    
    mushtraTab.addEventListener('click', function() {
        switchTab('mushtra-calculator', 'sleep-calculator', 'bmi-calculator', 'notes-calculator', mushtraTab, sleepTab, bmiTab, notesTab);
        renderMushtraTable();
        calculateMushtraStats();
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
    
    // === ФУНКЦИИ ДЛЯ СПИСКА МУШТРЫ ===
    
    // Сохранение данных муштры в localStorage
    function saveMushtraData() {
        localStorage.setItem('mushtraData', JSON.stringify(mushtraData));
    }
    
    // Получить количество дней в месяце
    function getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }
    
    // Получить название месяца
    function getMonthName(month) {
        const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        return months[month];
    }
    
    // Отрисовка таблицы муштры
    function renderMushtraTable() {
        const { skills, currentMonth, currentYear } = mushtraData;
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const monthName = getMonthName(currentMonth);
        
        currentMonthDisplay.textContent = `${monthName} ${currentYear}`;
        
        if (skills.length === 0) {
            mushtraTableContainer.innerHTML = `
                <div class="text-center py-8 opacity-70">
                    <i class="fas fa-list-check text-4xl mb-4"></i>
                    <p class="text-lg">Пока нет навыков для выработки</p>
                    <p class="text-sm mt-2">Добавьте первый навык выше!</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <table class="w-full text-white">
                <thead>
                    <tr class="border-b border-white border-opacity-30">
                        <th class="py-3 px-2 text-left font-semibold">Навык</th>
                        ${Array.from({length: daysInMonth}, (_, i) => 
                            `<th class="py-3 px-1 text-center font-semibold text-sm">${i + 1}</th>`
                        ).join('')}
                        <th class="py-3 px-2 text-center font-semibold">%</th>
                        <th class="py-3 px-2 text-center font-semibold"><i class="fas fa-trash"></i></th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        skills.forEach((skill, skillIndex) => {
            const completedDays = skill.completedDays || {};
            const successCount = Object.values(completedDays).filter(v => v === 'green').length;
            const failCount = Object.values(completedDays).filter(v => v === 'red').length;
            const objectiveCount = Object.values(completedDays).filter(v => v === 'blue').length;
            const skippedCount = Object.values(completedDays).filter(v => v === 'skipped').length;
            const totalMarked = successCount + failCount + objectiveCount;
            const percentage = totalMarked > 0 ? Math.round((successCount / totalMarked) * 100) : 0;
            
            html += `
                <tr class="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5">
                    <td class="py-3 px-2">
                        <input type="text" value="${skill.name}" 
                            onchange="updateSkillName(${skillIndex}, this.value)"
                            class="bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-purple-300 w-full text-sm">
                    </td>
                    ${Array.from({length: daysInMonth}, (_, day) => {
                        const dayKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day + 1).padStart(2, '0')}`;
                        const status = completedDays[dayKey] || null;
                        let cellClass = '';
                        let cellContent = '';
                        
                        if (status === 'green') {
                            cellClass = 'bg-green-500 bg-opacity-80';
                            cellContent = '<i class="fas fa-check"></i>';
                        } else if (status === 'red') {
                            cellClass = 'bg-red-500 bg-opacity-80';
                            cellContent = '<i class="fas fa-times"></i>';
                        } else if (status === 'blue') {
                            cellClass = 'bg-blue-500 bg-opacity-80';
                            cellContent = '<i class="fas fa-minus"></i>';
                        } else if (status === 'skipped') {
                            cellClass = 'line-through opacity-50';
                            cellContent = '—';
                        }
                        
                        return `
                            <td class="py-2 px-1 text-center cursor-pointer hover:bg-white hover:bg-opacity-10 transition" 
                                onclick="toggleMushtraCell(${skillIndex}, '${dayKey}')">
                                <div class="w-6 h-6 mx-auto flex items-center justify-center rounded ${cellClass}">
                                    ${cellContent}
                                </div>
                            </td>
                        `;
                    }).join('')}
                    <td class="py-3 px-2 text-center">
                        <span class="${percentage >= 80 ? 'text-green-400' : percentage >= 50 ? 'text-yellow-400' : 'text-red-400'} font-bold">
                            ${percentage}%
                        </span>
                    </td>
                    <td class="py-3 px-2 text-center">
                        <button onclick="deleteSkill(${skillIndex})" class="opacity-50 hover:opacity-100 transition">
                            <i class="fas fa-trash text-red-400"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
            <div class="mt-4 flex flex-wrap gap-4 text-xs opacity-80 justify-center">
                <div class="flex items-center gap-2">
                    <div class="w-4 h-4 bg-green-500 bg-opacity-80 rounded"></div>
                    <span>Выполнено (зелёный)</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-4 h-4 bg-red-500 bg-opacity-80 rounded"></div>
                    <span>Не выполнено (красный)</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-4 h-4 bg-blue-500 bg-opacity-80 rounded"></div>
                    <span>Объективная причина (синий)</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-4 h-4 line-through opacity-50"></div>
                    <span>Не требуется ежедневно</span>
                </div>
            </div>
        `;
        
        mushtraTableContainer.innerHTML = html;
    }
    
    // Переключение статуса ячейки
    window.toggleMushtraCell = function(skillIndex, dayKey) {
        const skill = mushtraData.skills[skillIndex];
        if (!skill.completedDays) {
            skill.completedDays = {};
        }
        
        const currentStatus = skill.completedDays[dayKey];
        
        // Цикл: null -> green -> red -> blue -> skipped -> null
        if (!currentStatus) {
            skill.completedDays[dayKey] = 'green';
        } else if (currentStatus === 'green') {
            skill.completedDays[dayKey] = 'red';
        } else if (currentStatus === 'red') {
            skill.completedDays[dayKey] = 'blue';
        } else if (currentStatus === 'blue') {
            skill.completedDays[dayKey] = 'skipped';
        } else {
            delete skill.completedDays[dayKey];
        }
        
        saveMushtraData();
        renderMushtraTable();
        calculateMushtraStats();
    };
    
    // Обновление названия навыка
    window.updateSkillName = function(skillIndex, newName) {
        mushtraData.skills[skillIndex].name = newName;
        saveMushtraData();
    };
    
    // Удаление навыка
    window.deleteSkill = function(skillIndex) {
        if (confirm('Удалить этот навык из списка?')) {
            mushtraData.skills.splice(skillIndex, 1);
            saveMushtraData();
            renderMushtraTable();
            calculateMushtraStats();
        }
    };
    
    // Добавление нового навыка
    addMushtraSkillBtn.addEventListener('click', function() {
        const skillName = mushtraSkillInput.value.trim();
        if (!skillName) {
            alert('Введите название навыка');
            return;
        }
        
        mushtraData.skills.push({
            name: skillName,
            completedDays: {}
        });
        
        mushtraSkillInput.value = '';
        saveMushtraData();
        renderMushtraTable();
        calculateMushtraStats();
    });
    
    // Переключение месяцев
    prevMonthBtn.addEventListener('click', function() {
        mushtraData.currentMonth--;
        if (mushtraData.currentMonth < 0) {
            mushtraData.currentMonth = 11;
            mushtraData.currentYear--;
        }
        saveMushtraData();
        renderMushtraTable();
        calculateMushtraStats();
    });
    
    nextMonthBtn.addEventListener('click', function() {
        mushtraData.currentMonth++;
        if (mushtraData.currentMonth > 11) {
            mushtraData.currentMonth = 0;
            mushtraData.currentYear++;
        }
        saveMushtraData();
        renderMushtraTable();
        calculateMushtraStats();
    });
    
    // ПЕРЕЗАГРУЗКА (сброс текущего месяца)
    resetMushtraBtn.addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите выполнить ПЕРЕЗАГРУЗКУ? Это очистит все отметки за текущий месяц для всех навыков!')) {
            const { currentMonth, currentYear } = mushtraData;
            
            mushtraData.skills.forEach(skill => {
                if (skill.completedDays) {
                    Object.keys(skill.completedDays).forEach(key => {
                        if (key.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`)) {
                            delete skill.completedDays[key];
                        }
                    });
                }
            });
            
            saveMushtraData();
            renderMushtraTable();
            calculateMushtraStats();
            alert('ПЕРЕЗАГРУЗКА выполнена! Начните месяц заново.');
        }
    });
    
    // Расчет статистики
    function calculateMushtraStats() {
        const { skills, currentMonth, currentYear } = mushtraData;
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
        
        if (skills.length === 0) {
            mushtraStatsDiv.innerHTML = `
                <div class="col-span-3 text-center opacity-70 py-4">
                    <p>Добавьте навыки для просмотра статистики</p>
                </div>
            `;
            return;
        }
        
        let totalGreen = 0;
        let totalRed = 0;
        let totalBlue = 0;
        let totalSkipped = 0;
        let totalPossible = skills.length * daysInMonth;
        
        skills.forEach(skill => {
            const completedDays = skill.completedDays || {};
            Object.entries(completedDays).forEach(([key, status]) => {
                if (key.startsWith(monthPrefix)) {
                    if (status === 'green') totalGreen++;
                    else if (status === 'red') totalRed++;
                    else if (status === 'blue') totalBlue++;
                    else if (status === 'skipped') totalSkipped++;
                }
            });
        });
        
        const completionRate = totalPossible > 0 ? Math.round((totalGreen / totalPossible) * 100) : 0;
        const activeDays = totalGreen + totalRed + totalBlue + totalSkipped;
        const remainingDays = totalPossible - activeDays;
        
        mushtraStatsDiv.innerHTML = `
            <div class="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                <div class="text-3xl font-bold text-green-400">${completionRate}%</div>
                <div class="text-sm opacity-80 mt-1">Успешность</div>
                <div class="text-xs opacity-60 mt-1">${totalGreen} из ${totalPossible} дней</div>
            </div>
            <div class="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                <div class="text-3xl font-bold text-blue-400">${activeDays}</div>
                <div class="text-sm opacity-80 mt-1">Отмечено дней</div>
                <div class="text-xs opacity-60 mt-1">
                    <span class="text-green-400">${totalGreen}</span> · 
                    <span class="text-red-400">${totalRed}</span> · 
                    <span class="text-blue-400">${totalBlue}</span>
                </div>
            </div>
            <div class="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                <div class="text-3xl font-bold text-purple-400">${remainingDays}</div>
                <div class="text-sm opacity-80 mt-1">Осталось дней</div>
                <div class="text-xs opacity-60 mt-1">до конца месяца</div>
            </div>
        `;
    }
    
    // Инициализация таблицы муштры при загрузке
    renderMushtraTable();
});