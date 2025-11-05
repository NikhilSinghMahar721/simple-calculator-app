class Calculator {
    constructor(previousEl, currentEl) {
        this.previousEl = previousEl;
        this.currentEl = currentEl;
        this.clear();
    }

    clear() {
        this.current = '0';
        this.previous = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        // If current display is just '0' and we have a previous operation
        if (this.current === '0' && this.previous !== '') {
            // Remove the operator and bring back the previous number
            this.current = this.previous.replace(/\s[+\-*/]\s*$/, '').trim();
            this.previous = '';
            this.operation = undefined;
            this.updateDisplay();
            return;
        }
        
        if (this.current === '0') return;
        this.current = this.current.slice(0, -1);
        if (this.current === '' || this.current === '-') {
            this.current = '0';
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.current.includes('.')) return;
        if (this.current === '0' && number !== '.') {
            this.current = number;
        } else {
            this.current += number;
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.current === '') return;
        if (this.previous !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previous = this.current + ' ' + operation;
        this.current = '0';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previous);
        const curr = parseFloat(this.current);
        if (isNaN(prev) || isNaN(curr)) return;

        switch (this.operation) {
            case '+':
                computation = prev + curr;
                break;
            case '-':
                computation = prev - curr;
                break;
            case '*':
                computation = prev * curr;
                break;
            case '/':
                computation = prev / curr;
                break;
            default:
                return;
        }

        this.current = computation.toString();
        this.operation = undefined;
        this.previous = '';
        this.updateDisplay();
    }

    updateDisplay() {
        this.currentEl.textContent = this.current;
        this.previousEl.textContent = this.previous;
    }
}

const previousEl = document.getElementById('previous');
const currentEl = document.getElementById('current');
const calc = new Calculator(previousEl, currentEl);

// Mouse input
document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        calc.appendNumber(button.dataset.number);
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 100);
    });
});

document.querySelectorAll('[data-operator]').forEach(button => {
    button.addEventListener('click', () => {
        calc.chooseOperation(button.dataset.operator);
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 100);
    });
});

document.querySelector('[data-action="equals"]').addEventListener('click', function() {
    calc.compute();
    this.classList.add('pressed');
    setTimeout(() => this.classList.remove('pressed'), 100);
});

document.querySelector('[data-action="clear"]').addEventListener('click', function() {
    calc.clear();
    this.classList.add('pressed');
    setTimeout(() => this.classList.remove('pressed'), 100);
});

document.querySelector('[data-action="delete"]').addEventListener('click', function() {
    calc.delete();
    this.classList.add('pressed');
    setTimeout(() => this.classList.remove('pressed'), 100);
});

// Keyboard input
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        calc.appendNumber(e.key);
        const btn = document.querySelector(`[data-number="${e.key}"]`);
        if (btn) {
            btn.classList.add('pressed');
            setTimeout(() => btn.classList.remove('pressed'), 100);
        }
    }
    
    if (['+', '-', '*', '/'].includes(e.key)) {
        calc.chooseOperation(e.key);
        const btn = document.querySelector(`[data-operator="${e.key}"]`);
        if (btn) {
            btn.classList.add('pressed');
            setTimeout(() => btn.classList.remove('pressed'), 100);
        }
    }
    
    if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calc.compute();
        const btn = document.querySelector('[data-action="equals"]');
        btn.classList.add('pressed');
        setTimeout(() => btn.classList.remove('pressed'), 100);
    }
    
    if (e.key === 'Backspace') {
        calc.delete();
        const btn = document.querySelector('[data-action="delete"]');
        btn.classList.add('pressed');
        setTimeout(() => btn.classList.remove('pressed'), 100);
    }
    
    if (e.key === 'Escape') {
        calc.clear();
        const btn = document.querySelector('[data-action="clear"]');
        btn.classList.add('pressed');
        setTimeout(() => btn.classList.remove('pressed'), 100);
    }
});