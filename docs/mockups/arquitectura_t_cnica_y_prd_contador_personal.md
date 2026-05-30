# Documento de Arquitectura y Diseño: App de Finanzas Personales "Contador Personal"

## 1. Visión General
Una aplicación web mobile-first diseñada para la gestión eficiente de finanzas personales, centrada en la claridad visual, la seguridad y la escalabilidad.

## 2. Arquitectura Técnica
### Frontend
- **Framework**: React.js (por su ecosistema y componentes reutilizables).
- **Estado**: Zustand (ligero y escalable para finanzas).
- **Estilos**: Tailwind CSS + Componentes tipo "Card UI".
- **Visualización**: Recharts o Chart.js para gráficos financieros.

### Backend (Propuesto)
- **Runtime**: Node.js con Express.
- **Autenticación**: JWT (JSON Web Tokens) con almacenamiento seguro en HttpOnly cookies.
- **API**: RESTful API.

### Base de Datos
Modelo Relacional (PostgreSQL):
- **Users**: id, name, email, password_hash, currency_pref.
- **Accounts**: id, user_id, name, type (cash, bank, card), balance.
- **Categories**: id, user_id (null for defaults), name, icon, type (income/expense).
- **Transactions**: id, user_id, account_id, category_id, amount, date, description, type.
- **Budgets**: id, user_id, category_id, limit_amount, period (monthly).
- **SavingsGoals**: id, user_id, name, target_amount, current_amount, deadline.

## 3. Seguridad
- **Password Hashing**: Argon2 o Bcrypt.
- **Sanitización**: Validación de esquemas con Zod o Joi.
- **CORS/Helmet**: Configuración de headers de seguridad.

## 4. Endpoints Principales (API)
- `POST /api/auth/register` & `POST /api/auth/login`
- `GET /api/dashboard/summary` (Balance, total mensual)
- `GET/POST/PUT/DELETE /api/transactions`
- `GET /api/budgets`
- `GET /api/categories`

## 5. Decisiones de Diseño UX
- **Modo Oscuro por Defecto**: Reduce la fatiga visual y da un aspecto premium.
- **Colores Semánticos**: Esmeralda para ingresos, Rosa/Rojo para gastos, Ámbar para alertas de presupuesto.
- **Micro-interacciones**: Feedback inmediato al registrar transacciones.
