module.exports = class ValidationUtils {

    isEmailValid(email) {
        const regX = new RegExp(/^[a-zA-Z0-9_]+(\.[_a-zA-Z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/)
        return regX.test(email)
    }

    isValidNumber(num, length) {
        const regX = new RegExp(/^[0-9]*$/)
        const result = regX.test(num)
        if (result) {
            return (num.length === length && Number(num) !== 0)
        }
        return false
    }

    isPasswordValid(password) {
        const regX = new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/)
        return regX.test(password)
    }

    isValidText(text) {
        const regX = new RegExp(/^[a-zA-Z .]*$/)
        return regX.test(text)
    }

    isValidDate(date, format) {
        let regX
        switch (format) {
            case 'dd-mm-yyyy': regX = new RegExp(/^([0-2][0-9]|(3)[0-1])(\-)(((0)[0-9])|((1)[0-2]))(\-)\d{4}$/)
                break
            case 'dd/mm/yyyy': regX = new RegExp(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)
                break
        }
        return regX.test(date)
    }

    isValidGender(gender) {
        let isValid = false
        const _gender = gender.toLowerCase()
        if (_gender === 'male' || _gender === 'female' || _gender === 'other') {
            isValid = true
        }
        return isValid
    }

    isValidPinCode(pin) {
        const regX = new RegExp(/^[1-9]{1}[0-9]{5}$/)
        return regX.test(pin)
    }

}
