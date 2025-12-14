document.addEventListener('DOMContentLoaded', function() {
    const wakeupTimeInput = document.getElementById('wakeup-time');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');
    const sleepTimesDiv = document.getElementById('sleep-times');
    const useCurrentTimeBtn = document.getElementById('use-current-time');

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
});