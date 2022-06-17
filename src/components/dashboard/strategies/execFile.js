// Execute File
export const execfile = (current) => {
    const request = { username: current.data.username };
    console.log("execfile");
    fetch("http://192.168.29.214:8000/api/execute/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    })
        .then((response) => {
            if (response.ok === true) return response.json();
            else {
                throw new Error();
            }
        })
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.log(error);
        });
};