// Функция для установки значения в localStorage
const set = (key, value, ttl) => {
    ttl *= 1000; // переводим в секунды

    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    };
    sessionStorage.setItem(key, JSON.stringify(item));
}

// Функция для получения значения из localStorage
const get = (key) => {
    const itemStr = sessionStorage.getItem(key);
    // Если элемент не найден, возвращаем null
    if (!itemStr) {
        return null;
    }
    try {
        const item = JSON.parse(itemStr);
        const now = new Date();
        // Если срок жизни элемента истек, удаляем его и возвращаем null
        if (now.getTime() > item.expiry) {
            sessionStorage.removeItem(key);
            return null;
        }
        // Иначе возвращаем значение элемента
        return item.value;
    } catch (e) {
        return itemStr;
    }
}

const pop = (key) => {
    const value = get(key);
    if (value) {
        sessionStorage.removeItem(value);
    }
    return value;
}

const remove = (key) => {
    sessionStorage.removeItem(key);
}


const functions = {get, set, pop, remove};
export default functions;