# StudentsLabTask

## Установка

1. Клонируйте репозиторий на свой компьютер
2. Установите зависимости с помощью команды `npm install`
3. Запустите приложение с помощью команды `npm start`

## Использование

Заполняете форму путем заполнения строк "Вопрос" и "Тип ответа". Если требуется добавляете варианты ответа в строке "Ответы", варианты добавляются через ;.
Добавляете вопрос в форму кнопкой "Добавить вопрос".

Если вы добавили все вопросы которые хотели, то вводите название формы в поле "Название формы" и нажимаете кнопку "Отправить".

Чтобы посмотреть как форма выглядит у пользователя введите название формы в строку "Название формы" и нажмите "Посмотреть".


## База данных

Я использую базу данных PostgreSQL для хранения форм.

Чтобы запустить проект, вам нужно создать базу данных `feedback` с помощью следующих команд SQL:

   CREATE DATABASE feedback;

Затем вы можете изменить учетные данные для доступа к базе данных в файле `db.js`.

### Примеры кода
   
javascript
	const client = require('./db');

   	client.query(SELECT * FROM feedback, (err, res) => {
     	if (err) {
       		console.error(err);
       		return;
     	}
    	console.log(res.rows);
   	});
