'use client'
import { useState } from 'react'

export default function ListingPage() {
  const [form, setForm] = useState({ companyName: '', contactName: '', email: '', description: '', jobTitle: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.companyName || !form.email || !form.jobTitle) {
      setError('会
