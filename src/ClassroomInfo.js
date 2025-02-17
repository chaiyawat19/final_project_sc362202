import React, { useEffect, useState } from "react";
import { db } from "./firebase"; // นำเข้า Firebase config
import { collection, getDocs } from "firebase/firestore"; // ใช้เพื่อดึงข้อมูลทั้งหมดจาก Firestore
import { Card, CardContent, CardMedia, Grid, Typography, Box } from "@mui/material"; // เพิ่ม Typography ที่นี่

function ClassroomList() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "classroom")); // ดึงข้อมูลทั้งหมดจาก collection "classroom"
        const classroomsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(), 
        }));

        setClassrooms(classroomsData); // ตั้งค่าข้อมูล classroom
      } catch (error) {
        console.error("Error getting documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        รายการห้องเรียนทั้งหมด
      </Typography>
      {classrooms.length > 0 ? (
        <Grid container spacing={3}>
          {classrooms.map((classroom) => (
            <Grid item xs={12} sm={6} md={4} key={classroom.id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  alt={classroom.info?.name}
                  height="140"
                  image={classroom.info?.photo || "https://via.placeholder.com/150"}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {classroom.info?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    รหัสวิชา: {classroom.info?.code}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ห้องเรียน: {classroom.info?.room}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <Typography variant="h6" color="text.secondary">
            ไม่พบข้อมูลห้องเรียน
          </Typography>
        </Box>
      )}
    </div>
  );
}

export default ClassroomList;
