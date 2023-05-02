#function reverse
def text_alpha_reverse(text):
    num = ""
    ini_string = ""
    for i in text:
        if i.isalpha():
            ini_string += i
        elif i.isnumeric():
            num += i
    text_alpha = ini_string[::-1] #reverse
    text_reverse = str(text_alpha) + str(num)
    return text_reverse


try:
    text = "NEGIE1"  # input text
    hasil = text_alpha_reverse(text)
    print(hasil)  # hasil
except:
    raise Exception("error sistem")
