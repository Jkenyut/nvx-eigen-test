# function count_similar
def count_similar(input, query):

    result = []
    for item in query:
        count = input.count(item)  # count item
        result.append(count)  # append to list
    return result  # result


try:
    INPUT = ['xc', 'dz', 'bbb', 'dz']  # input text
    QUERY = ['bbb', 'ac', 'dz']  # qury
    hasil = count_similar(INPUT, QUERY)
    print(hasil)  # hasil
except:
    raise Exception("error sistem")
