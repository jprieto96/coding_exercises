from array import array

# function that adds one to a number that is contained in an array
# and returns another array with the number + 1
def add_one(given_array):
    carry = 1
    result = []
    for i in reversed(given_array):
        s = i + carry
        if s == 10: carry = 1
        else: carry = 0
        if carry == 0: result.insert(0, s)
        else: result.insert(0, 0)

    if carry == 1:
        result.insert(0, 1)

    return result

if __name__ == "__main__":
    with open('data.txt', 'r') as f:
        file_content= f.readlines()
        for line in file_content:
            line = line.replace('\n', '')
            
            given_array = []
            for num in line:
                given_array.append(int(num))
            
            result_array = add_one(given_array)
            print(result_array)
