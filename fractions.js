// fractions.js — полная реализация класса Fraction
// Подключайте этот файл ДО calc.js

(function () {
  'use strict';

  // Вспомогательная функция: наибольший общий делитель
  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  // Класс Fraction
  class Fraction {
    constructor(num, den = 1) {
      // Проверки входных данных
      if (typeof num !== 'number' || typeof den !== 'number') {
        throw new Error('Числитель и знаменатель должны быть числами');
      }
      if (!isFinite(num) || !isFinite(den)) {
        throw new Error('Недопустимое значение: NaN или Infinity');
      }
      if (den === 0) {
        throw new Error('Знаменатель не может быть равен нулю');
      }

      this.num = num;
      this.den = den;
      this.reduce();
    }

    // Сокращение дроби до несократимой формы
    reduce() {
      if (this.num === 0) {
        this.den = 1;
        return;
      }
      const g = gcd(this.num, this.den);
      this.num = Math.round(this.num / g);
      this.den = Math.round(this.den / g);
      // Переносим минус в числитель
      if (this.den < 0) {
        this.num = -this.num;
        this.den = -this.den;
      }
    }

    // Арифметические операции
    add(other) {
      if (!(other instanceof Fraction)) other = new Fraction(other);
      return new Fraction(
        this.num * other.den + other.num * this.den,
        this.den * other.den
      );
    }

    sub(other) {
      if (!(other instanceof Fraction)) other = new Fraction(other);
      return new Fraction(
        this.num * other.den - other.num * this.den,
        this.den * other.den
      );
    }

    mul(other) {
      if (!(other instanceof Fraction)) other = new Fraction(other);
      return new Fraction(this.num * other.num, this.den * other.den);
    }

    div(other) {
      if (!(other instanceof Fraction)) other = new Fraction(other);
      if (other.num === 0) {
        throw new Error('Деление на ноль');
      }
      return new Fraction(this.num * other.den, this.den * other.num);
    }

    // Сравнение
    equals(other) {
      if (other instanceof Fraction) {
        return this.num === other.num && this.den === other.den;
      }
      if (typeof other === 'number') {
        return Math.abs(this.toDecimal() - other) < 1e-12;
      }
      return false;
    }

    // Копирование
    clone() {
      return new Fraction(this.num, this.den);
    }

    // Обратная дробь
    inverse() {
      if (this.num === 0) {
        throw new Error('Обратная дробь от нуля не существует');
      }
      return new Fraction(this.den, this.num);
    }

    // Преобразования
    toString() {
      if (this.den === 1) return String(this.num);
      return `${this.num}/${this.den}`;
    }

    toDecimal() {
      return this.num / this.den;
    }

    toMixedString() {
      if (Math.abs(this.num) < this.den) return this.toString();
      const isNegative = this.num < 0;
      const absNum = Math.abs(this.num);
      const whole = Math.floor(absNum / this.den);
      const remainder = absNum % this.den;
      if (remainder === 0) {
        return isNegative ? `-${whole}` : String(whole);
      }
      return isNegative ? `-${whole} ${remainder}/${this.den}` : `${whole} ${remainder}/${this.den}`;
    }

    // Статический метод: парсинг строки
    static parse(str) {
      if (typeof str !== 'string') {
        throw new Error('Ожидается строка');
      }
      const s = str.trim();
      if (s === '') {
        throw new Error('Пустая строка');
      }

      // Поддержка смешанных чисел: "2 3/4", "-1 2/5"
      const mixedMatch = s.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
      if (mixedMatch) {
        const [_, wholeStr, numStr, denStr] = mixedMatch;
        const whole = parseInt(wholeStr, 10);
        const num = parseInt(numStr, 10);
        const den = parseInt(denStr, 10);
        if (den <= 0) {
          throw new Error('Знаменатель должен быть положительным');
        }
        const totalNum = Math.abs(whole) * den + num;
        return new Fraction(whole < 0 ? -totalNum : totalNum, den);
      }

      // Обычная дробь или целое число
      if (s.includes('/')) {
        const parts = s.split('/');
        if (parts.length !== 2) {
          throw new Error('Некорректная дробь');
        }
        const n = parseFloat(parts[0]);
        const d = parseFloat(parts[1]);
        if (!isFinite(n) || !isFinite(d)) {
          throw new Error('Некорректные числа в дроби');
        }
        return new Fraction(n, d);
      }

      // Просто число
      const num = parseFloat(s);
      if (!isFinite(num)) {
        throw new Error('Некорректное число');
      }
      return new Fraction(num);
    }
  }

  // Экспорт в глобальную область видимости
  if (typeof window !== 'undefined') {
    window.Fraction = Fraction;
  }
  if (typeof global !== 'undefined') {
    global.Fraction = Fraction;
  }
})();
