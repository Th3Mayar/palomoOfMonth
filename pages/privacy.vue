<template>
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="px-6 py-8 sm:px-10">
                    <h1 class="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

                    <div class="prose max-w-none">
                        <p class="text-gray-600 mb-6">
                            Last updated: {{ new Date().toLocaleDateString() }}
                        </p>

                        <section class="mb-8">
                            <h2 class="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
                            <p class="text-gray-700 leading-relaxed">
                                Welcome to Palomo of the Month ("we," "our," or "us"). This Privacy Policy explains
                                how we collect,
                                use, disclose, and safeguard your information when you use our employee recognition
                                and scoring platform.
                                Our application helps organizations track daily employee performance and conduct
                                monthly voting to
                                recognize outstanding team members.
                            </p>
                        </section>

                        <section class="mb-8">
                            <h2 class="text-2xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
                            <h3 class="text-xl font-medium text-gray-700 mb-3">Personal Information</h3>
                            <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>Name and employee identification information</li>
                                <li>Email address and contact information</li>
                                <li>Department and role within the organization</li>
                                <li>Profile pictures and professional information</li>
                            </ul>

                            <h3 class="text-xl font-medium text-gray-700 mb-3">Performance Data</h3>
                            <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>Daily performance scores and ratings</li>
                                <li>Voting records and peer evaluations</li>
                                <li>Comments and feedback from supervisors and colleagues</li>
                                <li>Achievement records and recognition history</li>
                            </ul>

                            <h3 class="text-xl font-medium text-gray-700 mb-3">Technical Information</h3>
                            <ul class="list-disc list-inside text-gray-700 space-y-2">
                                <li>Device information and browser type</li>
                                <li>IP address and location data</li>
                                <li>Usage patterns and application interactions</li>
                                <li>Log files and error reports</li>
                            </ul>
                        </section>

                        <section class="mb-8">
                            <h2 class="text-2xl font-semibold text-gray-800 mb-4">3. How We Use Your Information
                            </h2>
                            <ul class="list-disc list-inside text-gray-700 space-y-2">
                                <li>To provide and maintain our employee recognition platform</li>
                                <li>To process voting and scoring for monthly employee recognition</li>
                                <li>To generate performance reports and analytics</li>
                                <li>To communicate with users about platform updates and results</li>
                                <li>To improve our services and user experience</li>
                                <li>To ensure platform security and prevent misuse</li>
                                <li>To comply with legal obligations and company policies</li>
                            </ul>
                        </section>

                        <section class="mb-8">
                            <h2 class="text-2xl font-semibold text-gray-800 mb-4">4. Information Sharing and
                                Disclosure</h2>
                            <p class="text-gray-700 mb-4">
                                We may share your information in the following circumstances:
                            </p>
                            <ul class="list-disc list-inside text-gray-700 space-y-2">
                                <li><strong>Within Your Organization:</strong> Performance data and scores may be
                                    shared with supervisors, HR departments, and management for evaluation purposes
                                </li>
                                <li><strong>Aggregated Data:</strong> Anonymous, aggregated statistics may be shared
                                    for organizational insights</li>
                                <li><strong>Legal Requirements:</strong> When required by law, regulation, or legal
                                    process</li>
                                <li><strong>Service Providers:</strong> With trusted third-party vendors who assist
                                    in platform operation</li>
                                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions,
                                    or asset sales</li>
                            </ul>
                        </section>

                        <section class="mb-8">
                            <h2 class="text-2xl font-semibold text-gray-800 mb-4">5. Data Security</h2>
                            <p class="text-gray-700">
                                We implement appropriate technical and organizational security measures to protect
                                your personal
                                information against unauthorized access, alteration, disclosure, or destruction.
                                This includes
                                encryption, secure data transmission, access controls, and regular security
                                assessments.
                            </p>
                        </section>

                        <section class="mb-8">
                            <h2 class="text-2xl font-semibold text-gray-800 mb-4">6. Your Rights</h2>
                            <p class="text-gray-700 mb-4">You have the right to:</p>
                            <ul class="list-disc list-inside text-gray-700 space-y-2">
                                <li>Access and review your personal information</li>
                                <li>Request corrections to inaccurate data</li>
                                <li>Request deletion of your personal information (subject to organizational
                                    policies)</li>
                                <li>Object to certain processing activities</li>
                                <li>Request data portability</li>
                                <li>Withdraw consent where applicable</li>
                            </ul>
                        </section>

                        <section class="mb-8">
                            <h2 class="text-2xl font-semibold text-gray-800 mb-4">7. Data Retention</h2>
                            <p class="text-gray-700">
                                We retain your information for as long as necessary to fulfill the purposes outlined
                                in this
                                Privacy Policy, comply with legal obligations, resolve disputes, and enforce our
                                agreements.
                                Performance data may be retained for historical reporting and trend analysis
                                purposes.
                            </p>
                        </section>

                        <section class="mb-8">
                            <h2 class="text-2xl font-semibold text-gray-800 mb-4">8. Changes to This Privacy Policy
                            </h2>
                            <p class="text-gray-700">
                                We may update this Privacy Policy from time to time. We will notify you of any
                                material changes
                                by posting the updated policy on this page and updating the "Last updated" date.
                                Your continued
                                use of the platform after such changes constitutes acceptance of the updated policy.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// Set page metadata
useHead({
    title: 'Privacy Policy - Palomo of the Month',
    meta: [
        { name: 'description', content: 'Privacy Policy for Palomo of the Month employee recognition platform' }
    ]
})
</script>