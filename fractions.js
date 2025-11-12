// fraction.js — работа с дробями

// функция для сокращения дробей
function gcd(a, b) { return b ? gcd(b, a % b) : a; }

export class Fraction {
  constructor(num, den = 1) {
    if (den === 0) throw new Error("Знаменатель не может быть равен 0");
    this.num = num;
    this.den = den;
    this.reduce();
  }

  // сокращение дроби
  reduce() {
    const g = gcd(Math.abs(this.num), Math.abs(this.den));
    this.num /= g;
    this.den /= g;
    if (this.den < 0) { this.num *= -1; this.den *= -1; }
  }

  // арифметика
  add(f) { return new Fraction(this.num * f.den + f.num * this.den, this.den * f.den); }
  sub(f) { return new Fraction(this.num * f.den - f.num * this.den, this.den * f.den); }
  mul(f) { return new Fraction(this.num * f.num, this.den * f.den); }
  div(f) { return new Fraction(this.num * f.den, this.den * f.num); }

  // строковое представление
  toString() { return this.den === 1 ? `${this.num}` : `${this.num}/${this.den}`; }
  toDecimal() { return this.num / this.den; }

  // 🔧 новые методы
  equals(f) { return this.num === f.num && this.den === f.den; }        // сравнение дробей
  clone() { return new Fraction(this.num, this.den); }                  // копия
  inverse() { return new Fraction(this.den, this.num); }                // обратная дробь
  toMixedString() {                                                     // смешанное число
    if (Math.abs(this.num) < this.den) return this.toString();
    const whole = Math.trunc(this.num / this.den);
    const remainder = Math.abs(this.num % this.den);
    return remainder ? `${whole} ${remainder}/${this.den}` : `${whole}`;
  }
}
