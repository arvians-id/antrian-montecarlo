// <!-- CREATED BY WIDDY ARFIANSYAH -->
// <!-- Follow My Github https://github.com/arvians-id -->
// <!-- https://github.com/arvians-id/antrian-montecarlo -->
// <!-- Sumber Data https://media.neliti.com/media/publications/275681-pemodelan-dan-simulasi-sistem-antrian-pe-e7e0166c.pdf -->

const tableAntrian = document.querySelector('#table-antrian');
const tableLoket = document.querySelector('#table-loket');
const tableKedatangan = document.querySelector('#table-kedatangan');
const tablePelayanan = document.querySelector('#table-pelayanan');
const tableSimulasi = document.querySelector('#table-simulasi');

const file = fetch('data.json').then(res => res.json());

// Convert Time menjadi timestamp
const convertToTime = time => {
    let array = time.split(':');
    return (+array[0]) * 60 * 60 + (+array[1]) * 60;
};

// Check jika bilangan acak lebih besar dan lebih kecil dari angka yang ditentukan
const check = (bil, first, end) => {
    if(bil >= first && bil <= end){
        return true;
    }
    return false;
}

// Eksekusi kode disini
const print = async () => {
    const datas = await file;
    
    // TABEL PERTAMA
    let dataTable = '';
    let jumlahWaktuAntrian = 0;
    let waktuPelayanan = [];
    let split = []
    datas.forEach((data, i) => {
        // Push Data Ke Tabel pertama
        const kedatangan = convertToTime(data.kedatangan);
        const dilayani = convertToTime(data.dilayani);
        const selesai = convertToTime(data.selesai);

        const lamaPelayanan = (selesai - dilayani) / 60;
        const waktuDalamSistem = (selesai - kedatangan) / 60;
        const waktuDalamAantrian = (dilayani - kedatangan) / 60;

        // Push data lama pelayanan ke waktu pelayanan
        waktuPelayanan.push(lamaPelayanan);

        jumlahWaktuAntrian += waktuDalamAantrian;
        dataTable += `<tr>
                        <td>${i + 1}</td>
                        <td>${data.kedatangan}</td>
                        <td>${data.dilayani}</td>
                        <td>${data.selesai}</td>
                        <td></td>
                        <td>${lamaPelayanan}</td>
                        <td>${waktuDalamSistem}</td>
                        <td>${waktuDalamAantrian}</td>
                        </tr>`;

        // Lakukan push data hanya data yang sudah d split atau d pisah menjadi array berdasarkan ':'
        split.push(+data.kedatangan.split(':')[1]);
    })

    // Filter data jika terdapat NaN dalam array waktuKedatangan
    let waktuKedatangan = [];
    for(let i= split.length; i >= 0; i--){
        let newArray = split[i] - split[i - 1];
        if(!isNaN(newArray)) waktuKedatangan.push(newArray)
    }
    
    // Push 1 row dan tampilkan pada HTML
    dataTable += `<tr>
                    <td colspan="7">Rata-rata waktu menunggu antrian</td>
                    <td>${(jumlahWaktuAntrian / datas.length).toFixed(2)} Menit</td>
                    </tr>`;
    tableAntrian.innerHTML = dataTable;
    

    // TABEL KEDUA
    // Car min dan max dari sebuah array yang sudah difilter diatas
    const minWaktuKedatangan = Math.min.apply(null, waktuKedatangan);
    const maxWaktuKedatangan = Math.max.apply(null, waktuKedatangan);

    const minWaktuPelayanan = Math.min.apply(null, waktuPelayanan);
    const maxWaktuPelayanan = Math.max.apply(null, waktuPelayanan);
    // Buat interval dari seluruh data / maximum waktu pelayanan
    const nilaiInterval = Math.floor(datas.length / Math.max.apply(null, waktuPelayanan));
    
    // Push data ke HTML
    tableLoket.innerHTML = `<tr>
                                <td>Jumlah Pelanggan</td>
                                <td>${datas.length} Pelanggan</td>
                            </tr>
                            <tr>
                                <td>Waktu Kedatangan</td>
                                <td>${minWaktuKedatangan + ' - ' + maxWaktuKedatangan} Menit</td>
                            </tr>
                            <tr>
                                <td>Waktu Pelayanan</td>
                                <td>${minWaktuPelayanan + ' - ' + maxWaktuPelayanan} Menit</td>
                            </tr>
                            <tr>
                                <td>Jumlah Interval</td>
                                <td>${datas.length}/${maxWaktuPelayanan} = ${ nilaiInterval } Nilai</td>
                            </tr>`;
    
    // TABEL KETIGA
    let dataTableWaktuKedatangan = '';
    let dataIntvalKedatangan = [];
    let startKedatangan = 1;
    let endKedatangan = 0;
    // Push data ke HTML
    for(let i=minWaktuKedatangan; i<=maxWaktuKedatangan; i++){
        endKedatangan = endKedatangan + nilaiInterval
        dataTableWaktuKedatangan += `<tr>
                                        <td>${i}</td>
                                        <td>${startKedatangan} - ${endKedatangan}</td>
                                        </tr>`;

        // Push ini digunakan untuk mencari tahu bilangan acak
        dataIntvalKedatangan.push([startKedatangan, endKedatangan, i]);
        startKedatangan = endKedatangan + 1
    }
    tableKedatangan.innerHTML = dataTableWaktuKedatangan;
    
    // TABEL KEEMPAT
    let dataTableWaktuPelayanan = '';
    let dataIntvalPelayanan = [];
    let startPelayanan = 1;
    let endPelayanan = 0;
    // Push data ke HTML
    for(let i=minWaktuPelayanan; i<=maxWaktuPelayanan; i++){
        endPelayanan = endPelayanan + nilaiInterval
        dataTableWaktuPelayanan += `<tr>
                                        <td>${i}</td>
                                        <td>${startPelayanan} - ${endPelayanan}</td>
                                        </tr>`;

        // Push ini digunakan untuk mencari tahu bilangan acak
        dataIntvalPelayanan.push([startPelayanan, endPelayanan, i]);
        startPelayanan = endPelayanan + 1
    }
    tablePelayanan.innerHTML = dataTableWaktuPelayanan;

    // TABEL KELIMA
    let dataTableSimulasi = '';
    let count;
    // Push data ke HTML
    for(let i=0; i<datas.length;i++){
        // Convert ke timestamp
        const kedatangan = convertToTime(datas[i].kedatangan);
        const dilayani = convertToTime(datas[i].dilayani);
        const selesai = convertToTime(datas[i].selesai);
        
        const waktuDalamSistem = (selesai - kedatangan) / 60;
        const waktuDalamAantrian = (dilayani - kedatangan) / 60;

        // Bilangan acak pertama
        // Mencari tahu interval waktu pada bilangan acak
        let bilAcak = Math.floor(Math.random() * datas.length) + 1;
        let intvalAcak = 0;
        dataIntvalKedatangan.map(val => {
            if(check(bilAcak, val[0], val[1])){
                intvalAcak = val[2]
            }
        })

        // Bilangan acak kedua
        // Mencari tahu interval waktu pada bilangan acak
        let bilAcakKedua = Math.floor(Math.random() * datas.length) + 1;
        let intvalAcakKedua = 0;
        dataIntvalPelayanan.map(val => {
            if(check(bilAcakKedua, val[0], val[1])){
                intvalAcakKedua = val[2]
            }
        })
        
        // Montecarlo
        // Split data kedatangan
        let first = datas[i].kedatangan.split(':')[1];
        // Split data selesai dengan ambil data index sebelumnya
        let end = datas[i - 1] == undefined ? 0 : datas[i - 1].selesai.split(':')[1];
        // Jika index sudah melewati 0 gunakan varivale count jika tidak gunakan end
        // Dan compare data diatas dengan variable first
        let status = (i > 0 ? count : end) <= first;
        // Variable td ini akan dipasing ke dalam template literal
        let td = '';
        // Jika status menghasilkan true, maka tabel akan menghasilkan nilai disebelah kiri
        if(status == true){
            td =`<td>${datas[i].dilayani}</td>
                    <td>${bilAcakKedua}</td>
                    <td>${intvalAcakKedua}</td>
                    <td>${datas[i].selesai}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>`;
            
            // Ambil data selesai yang true saja
            count = datas[i].selesai.split(':')[1];
        }

        // Jika status menghasilkan true, maka tabel akan menghasilkan nilai disebelah kanan
        if(status == false){
            td =`<td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>${datas[i].dilayani}</td>
                    <td>${bilAcakKedua}</td>
                    <td>${intvalAcakKedua}</td>
                    <td>${datas[i].selesai}</td>`
        }
        
        dataTableSimulasi += `<tr>
                                <td>${i + 1}</td>
                                <td>${bilAcak}</td>
                                <td>${intvalAcak}</td>
                                <td>${datas[i].kedatangan}</td>`
                                + td +
                                `<td>${waktuDalamSistem}</td>
                                <td>${waktuDalamAantrian}</td>
                                </tr>`;
    }
    dataTableSimulasi += `<tr>
                    <td colspan="13">Rata-rata waktu menunggu antrian</td>
                    <td>${(jumlahWaktuAntrian / datas.length).toFixed(2)} Menit</td>
                    </tr>`;
    tableSimulasi.innerHTML = dataTableSimulasi;
}
print()

// <!-- CREATED BY WIDDY ARFIANSYAH -->
// <!-- Follow My Github https://github.com/arvians-id -->
// <!-- https://github.com/arvians-id/antrian-montecarlo -->
// <!-- Sumber Data https://media.neliti.com/media/publications/275681-pemodelan-dan-simulasi-sistem-antrian-pe-e7e0166c.pdf -->