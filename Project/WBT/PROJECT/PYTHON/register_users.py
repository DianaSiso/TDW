def add_user(email, password):
    c = 0

    # Find out how many lines the file has.
    with open("../DB/users.json", "r") as f:
        lines = f.readlines()
        c = c + 1

    # Clear the file
    file = open("../DB/users.json", "w").close()
    file = open("../DB/users.json", "a")

    for line in lines[:(c - 4)]:
        file.write(line)
        print(line)

    file.write("\t\t},")
    file.write("\t\t{")
    file.write('\t\t\t"email" : ' + email + ',')
    file.write('\t\t\t"password : ' + password)
    file.write("\t\t}")
    file.write("\t]")
    file.write("}")

    file.close()

if __name__ == "__main__":
    add_user(user_email, user_password)