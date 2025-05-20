# fungsi longest string
def longest(text):
    long = []
    array = text.split(" ")
    for i in array:
        long.append(len(i))
    return max(long)  # max length


try:
    text = "Saya sangat senang mengerjakan soal algoritma"  # input text
    hasil = longest(text)
    print(hasil)  # hasil
except:
    raise Exception("error sistem")
