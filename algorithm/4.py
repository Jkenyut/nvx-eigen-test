# function subtraction_matrix
def subtraction_matrix(matrix, n):
    diagonal1 = 0
    diagonal2 = 0
    for i in range(n):
        diagonal1 += matrix[i][i]  # diagonal top right to bottom
        diagonal2 += matrix[i][n - i - 1]  # diagonal  top left to bottom

    return diagonal1 - diagonal2  # subraction of diagonal


try:
    matrix = [[1, 1, 0], [4, 5, 6], [7, 8, 9]]  # input matrix
    hasil = subtraction_matrix(matrix, len(matrix))
    print(hasil)  # hasil
except:
    raise Exception("error sistem")
