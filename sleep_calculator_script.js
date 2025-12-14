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
    const sleepCalculator = document.getElementById('sleep-calculator');
    const bmiCalculator = document.getElementById('bmi-calculator');
    
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
    
    // Функция переключения вкладок
    function switchTab(showTabId, hideTabId, activeTabBtn, inactiveTabBtn) {
        document.getElementById(showTabId).classList.remove('hidden');
        document.getElementById(hideTabId).classList.add('hidden');
        
        activeTabBtn.classList.add('active-tab');
        inactiveTabBtn.classList.remove('active-tab');
    }
    
    // Обработчики вкладок
    sleepTab.addEventListener('click', function() {
        switchTab('sleep-calculator', 'bmi-calculator', sleepTab, bmiTab);
    });
    
    bmiTab.addEventListener('click', function() {
        switchTab('bmi-calculator', 'sleep-calculator', bmiTab, sleepTab);
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
});